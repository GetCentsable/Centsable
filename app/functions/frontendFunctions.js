const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

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

// Function returns db data for accounts page
exports.getLinkedAccounts = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // Extract uid from body
          const uid = req.body.uid;

          if (!uid) {
            return res.status(500).send({ error: 'uid is required' });
          }

          // Create a reference to the user linked accounts/token doc
          const user_token_ref = db.collection('users_tokens').doc(uid);

          // Create a snapshot of doc to read data
          const user_token_doc = await user_token_ref.get();

          // Ensure doc exists and is not empty
          if (!user_token_doc.exists) {
            return res.status(500).send({ error: 'User does not have linked accounts' });
          }

          // Retrieve document data
          const user_accounts_data = user_token_doc.data();

          // Create array to send to front end with account information needed
          const user_banks = [];
          
          // Loop through banks for user in Firestore
          if (user_accounts_data.banks && Array.isArray(user_accounts_data.banks)) {
            for (const bank of user_accounts_data.banks) {
              // Extract bank info
              const institution_name = bank.institution_name;

              // Create account array
              const user_accounts = [];

              // Loop through the accounts for each bank
              for (const account of bank.accounts) {
                const mask = account.mask;
                const account_name = account.name;
                const subtype = account.subtype;

                // Create account object and add it to account array
                const user_account_object = {
                  mask: mask,
                  account_name: account_name,
                  subtype: subtype,
                };
                user_accounts.push(user_account_object);
              }

              // Create user bank object and add it to bank array
              const user_bank_object = {
                institution_name: institution_name,
                accounts: user_accounts,
              };
              user_banks.push(user_bank_object);
            }
          } else {
            return res.status(500).send({ error: 'No banks linked for the user' });
          }

          // Return result on success
          res.status(200).send({ user_banks: user_banks });
        } catch (error) {
          console.error('Error fetching linked accounts:', error.message);
          res.status(500).send({ error: 'Error fetching linked accounts' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(403).send('Unauthorized');
    }
  });
});

// Function gathers non sensitive user transaction
// data and sends to front end
exports.getUserTransactions = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // Get the user's ID from the request
          const uid = req.body.uid;

          // Create a reference to the user's transactions sub-collection
          const userTransCollectionRef = db.collection('users').doc(uid).collection('transactions');

          // Get a snapshot of the collection to retrieve the data
          const userTransCollectionSnap = await userTransCollectionRef.get();

          // Create an object to hold the transactions data
          const user_transactions = {};

          // Loop through each document in the snapshot to gather transaction data
          userTransCollectionSnap.forEach(doc => {
            const transaction_date = doc.data();

            // Loop through each transaction of a date to gather data needed
            for (const [trans_id, transaction] of Object.entries(transaction_date)) {
              // Check if transaction amount is 0 or negative to skip transaction
              if (transaction.amount <= 0) {
                continue;
              }

              // Object holds current transaction data we want to send to front end
              const transaction_data = {
                amount: transaction.amount,
                date: transaction.date,
                logo_url: transaction.logo_url,
                merchant_name: transaction.merchant_name,
                round_up: transaction.round_up,
                website: transaction.website,
              };

              // Add the current transaction to the object returned
              user_transactions[trans_id] = transaction_data;
            }
          });

          // On success, send the transactions to the front end
          res.status(200).send(user_transactions);
        } catch (error) {
          console.error('Error getting user transactions', error.response ? error.response.data : error.message);
          res.status(500).send({ error: 'Error retrieving user transactions' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(403).send('Unauthorized');
    }
  });
});
