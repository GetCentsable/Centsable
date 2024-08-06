const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { format, subDays } = require('date-fns');
const { Configuration, PlaidApi, Products, PlaidEnvironments } = require('plaid');

// Environment variables
const PLAID_CLIENT_ID = functions.config().plaid.client_id;
const PLAID_SECRET = functions.config().plaid.secret;
const PLAID_ENV = 'sandbox';

// Create instance of plaid client to communicate with the plaid API
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Create instance of admin db
const db = admin.firestore();

// Middleware to verify Firebase ID tokens
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error('Unauthorized: No Bearer token');
    return res.status(403).send('Unauthorized');
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Unauthorized: Invalid token', error);
    return res.status(403).send('Unauthorized');
  }
};

// Step 2:
// Creates a link token to be passed back to client(user),
// then sent to plaid API for starting a link
exports.createLinkToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // console.log('Creating link token for user:', req.user.uid);
          const response = await plaidClient.linkTokenCreate({
            user: {
              client_user_id: req.user.uid,
            },
            client_name: 'Centsable',
            products: [Products.Auth, Products.Transactions, Products.Identity],
            country_codes: ['US'],
            language: 'en',
          });
          // console.log('Link token created:', response.data);
          res.status(200).send(response.data);
        } catch (error) {
          console.error('Error creating link token:', error.response ? error.response.data : error.message);
          res.status(500).send({ error: 'Error creating link token' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(403).send('Unauthorized');
    }
  });
});

// Step 5:
// Make a call to itemPublicTokenExchange() to retrieve
// access token for user and store it in db
exports.exchangePublicToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // Extract public token and uid from body
          const PUBLIC_TOKEN = req.body.public_token;
          const uid = req.body.uid;

          if (!PUBLIC_TOKEN || !uid ) {
            return res.status(400).send({ error: 'public_token and uid are required' });
          }

          // Send request to Plaid for access token
          const response = await plaidClient.itemPublicTokenExchange({
            public_token: PUBLIC_TOKEN,
          });

          // Extract access token from Plaid API response
          const { access_token: ACCESS_TOKEN, item_id: ITEM_ID } = response.data;

          if (ACCESS_TOKEN && ITEM_ID) {
            // Retrieve information about the item to get the institution details
            const itemResponse = await plaidClient.itemGet({
              access_token: ACCESS_TOKEN,
            });

            // Institution Id from itemResponse
            const institutionId = itemResponse.data.item.institution_id;

            // If the institution is present in the id extract the institution name
            let institutionName = 'Unknown Institution';
            if (institutionId) {
              const institutionResponse = await plaidClient.institutionsGetById({
                institution_id: institutionId,
                country_codes: ['US'],
              });
              institutionName = institutionResponse.data.institution.name;
            }

            // Create auth request to retrieve account mask and numbers
            const authResponse = await plaidClient.authGet({
              access_token: ACCESS_TOKEN,
            })

            // Store account information in array for bankData
            const accounts = [];
            if (authResponse && authResponse.data.accounts) {
              for (const account of authResponse.data.accounts) {
                // Gather attributes
                const mask = account.mask;
                const name = account.name;
                const official_name = account.official_name;
                const subtype = account.subtype;

                // Store attributes in object and append to accounts array
                const account_object = {
                  mask: mask,
                  name: name,
                  official_name: official_name,
                  subtype: subtype,
                }

                accounts.push(account_object);
              }
            }

            // Create user ref to tokens collection
            const userTokenRef = db.collection('users_tokens').doc(uid);

            // Fetch the doc to check if it exists
            const doc = await userTokenRef.get();

            // Create bank data object to store in firestore
            const bankData = {
              plaid_token: ACCESS_TOKEN,
              item_id: ITEM_ID,
              institution_id: institutionId,
              institution_name: institutionName,
              accounts: accounts
            }

            if (!doc.exists) {
              // Create the doc if it does not exists
              await userTokenRef.set({
                banks: [bankData]
              });
            } else {
              // Update the user doc if it exists with the access token / item id
              await userTokenRef.set({
                banks: admin.firestore.FieldValue.arrayUnion(bankData),
              }, { merge: true});
            }

            // Debug logs
            console.log(response.data)

            // If successfull send only response of sucess
            res.status(200).send({ success: true });
          } else {
            res.status(500).send({ error: 'Failed to retrieve access token or item ID' });
          }
        } catch (error) {
          console.error('Error retrieving access token:', error.response ? error.response.data : error.message);
          res.status(500).send({ error: 'Error retrieving access token' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(403).send('Unauthorized');
    }
  });
});

// Function that loads user transactions from API for specified
// bank and user into the firestore db
exports.loadAllUserTransactions = functions.https.onRequest(async (req, res) => {
  try {
    // Step 1:
    // Get users_tokens collection reference
    const userTokenCollectionRef = db.collection('users_tokens');

    // Get all documents in the users_tokens collection
    const userTokenSnapshot = await userTokenCollectionRef.get();

    if (userTokenSnapshot.empty) {
      console.log('Error finding users_tokens collection');
      res.status(500).send('No users_tokens collection found');
      return;
    }

    // Step 2:
    // Loop through each user document, and get banks array for user
    for (const doc of userTokenSnapshot.docs) {
      // Retrieve document info for later user
      const doc_id = doc.id;
      const doc_data = doc.data();

      // Step 3:
      // For each doc loop through the user banks and make
      // a get request with specified parameters
      for (const bank of doc_data.banks) {
        // Get the current date
        const currentDate = new Date();
        const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');

        // Get the date 90 days prior
        const priorDate = subDays(currentDate, 90);
        const formattedPriorDate = format(priorDate, 'yyyy-MM-dd');

        // Request parameters to be sent to API endpoint transactions/get
        const transaction_get_request = {
          access_token: bank.plaid_token,
          start_date: formattedPriorDate,
          end_date: formattedCurrentDate,
        }

        // Making request to transactions/get endpoint, passing in parameters
        const transaction_response = await plaidClient.transactionsGet(transaction_get_request);

        // Ensure request success
        if (!transaction_response) {
          console.log('Transaction get request failed');
          continue; // Skip to the next iteration
        }

        // Pull transactions from response data
        const transactions = transaction_response.data.transactions;

        // Ensure transactions are not empty
        if (transactions.length === 0) {
          console.log('Transactions are empty');
          continue; // Skip to the next iteration
        }
        
        // Step 4:
        // Find matching user doc in user collection and merge transactions
        // ensuring duplicate transactions do not exist
        
        // Reference the users collection where the doc id matches users_tokens doc id
        const usersDocRef = db.collection('users').doc(doc_id);

        // Snapshot of the matching user doc
        const userSnapshot = await usersDocRef.get();

        if (!userSnapshot.exists) {
          console.log('Error finding user in users collection');
          continue; // Skip to the next iteration
        }

        // Loop through each transaction returned by plaid API,
        // and add that transaction to the user's transactions
        // sub-collection ordered by date
        for (const transaction of transactions) {
          // Check the transaction date to add to correct doc
          const transactionDate = transaction.date;

          // Create a reference to the transaction subcollection
          const transactionDocRef = usersDocRef.collection('transactions').doc(transactionDate);

          await transactionDocRef.set({
            [transaction.transaction_id]: transaction,
          }, { merge: true });
        }

        // Log success / debug log
        console.log(`Transactions for user ${doc_id} updated successfully!`);
      }
    }

    console.log('All user transactions have been loaded, Success!');
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error fetching users transactions:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Error fetching user transactions' });
  }
});

exports.loadAllUserTransactionsNightly = functions.pubsub.schedule('0 3 * * *')
  .timeZone('America/Chicago')
  .onRun((context) => {
    console.log('This function runs every night at 3 AM Central Time.');
    // Code to get user transactions nightly
    return null;
  });