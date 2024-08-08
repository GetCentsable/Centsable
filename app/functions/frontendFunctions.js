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
            return res.status(400).send({ error: 'uid is required' });
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

          if (!uid) {
            return res.status(400).send({ error: 'uid is required' });
          }

          // Create a reference to the user's transactions sub-collection
          const userTransCollectionRef = db.collection('users').doc(uid).collection('transactions');

          // Get a snapshot of the collection to retrieve the data
          const userTransCollectionSnap = await userTransCollectionRef.get();

          // Create an array to hold the transactions data
          const user_transactions = [];

          // Loop through each document in the snapshot to gather transaction data
          userTransCollectionSnap.forEach(doc => {
            const transaction_date = doc.data();
            const dateKey = doc.id;

            // Create an object to store transactions for each date
            const transactions_for_date = {};

            // Loop through each transaction of a date to gather data needed
            for (const [trans_id, transaction] of Object.entries(transaction_date)) {
              // Check if transaction amount is 0 or negative to skip transaction
              if (transaction.amount <= 0) {
                continue;
              }

              // Convert Date for front end
              const [year, month, day] = transaction.date.split('-');
              const converted_date = `${parseInt(month)}/${parseInt(day)}/${year}`;

              // Object holds current transaction data we want to send to front end
              const transaction_data = {
                amount: transaction.amount,
                date: converted_date,
                logo_url: transaction.logo_url,
                merchant_name: transaction.merchant_name,
                round_up: transaction.round_up,
                website: transaction.website,
              };

              // Add the current transaction to the transactions object
              transactions_for_date[trans_id] = transaction_data;
            }

            // Add the transactions object to the user
            // transactions array with the date as the key
            // as long as the transactions object is not empty
            if (Object.keys(transactions_for_date).length > 0) {
              user_transactions.push({ [dateKey]: transactions_for_date });
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

// Function adds selected recipient to user collection
// and return all recipients
exports.addNewRecipient = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // Extract uid from body
          const uid = req.body.uid;
          const recipient_id = req.body.recipient_id;
          const recipient_name = req.body.recipient_name;

          if (!uid || !recipient_id || !recipient_name) {
            return res.status(400).send({ error: 'Recipient name, uid and recipient id is required' });
          }

          // Step 1:
          // Find the user collection that matches uid

          // Create referene to matching doc
          const user_doc_ref = db.collection('users').doc(uid);

          // Create snapshot of doc to read data
          const user_doc_snap = await user_doc_ref.get();

          // Step 2:
          // Grab the current recipients array

          if (user_doc_snap.exists) {
            // Get the data from the document snapshot
            const user_data = user_doc_snap.data();
            const current_recipients = user_data.recipients || [];
            
            // Check if the recipients already exists
            const recipient_exists = current_recipients.some(recipient => recipient.recipient_id === recipient_id);

            if (!recipient_exists) {
              // Step 3:
              // Calculate the total recipients + the new one being added
              const total_recipients = current_recipients.length + 1;

              // Step 4:
              // Adjust the percentages to = 100% / total recipients

              // Calculate base percentage and distribute it
              const base_percentage = Math.ceil(100 / total_recipients);
              const percentages = Array(total_recipients).fill(base_percentage);

              // Adjust the last recipient's percentage to make the total 100%
              const total_base_percentage = base_percentage * total_recipients;
              const difference = total_base_percentage - 100;
              percentages[percentages.length - 1] -= difference;

              // Assign percentages to current recipients
              current_recipients.forEach((recipient, index) => {
                recipient.percentage = percentages[index];
              });
              
              // Step 5:
              // Merge the new recipient to the current recipient array
              const new_recipient = {
                recipient_id,
                recipient_name,
                percentage: percentages[percentages.length - 1]
              };
              current_recipients.push(new_recipient);
              
              // Update the document in Firestore
              await user_doc_ref.update({ recipients: current_recipients });

              // Step 6:
              // Send the data back to front end
              return res.status(200).send({ success: true, current_recipients });
            } else {
              return res.status(400).send({ error: 'Recipient already exists' });
            }
          } else {
            return res.status(404).send({ error: 'User not found' });
          }
        } catch (error) {
          console.error('Error adding recipient:', error.message);
          res.status(500).send({ error: 'Error adding recipient' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(403).send('Unauthorized');
    }
  });
});

// Function removes a passed in recipient from users preferences
exports.removeRecipient = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // Extract uid and recipient_id from body
          const uid = req.body.uid;
          const recipient_id = req.body.recipient_id;

          if (!uid || !recipient_id) {
            return res.status(400).send({ error: 'Recipient id and uid are required' });
          }

          // Step 1:
          // Find the user collection that matches uid

          // Create reference to matching doc
          const user_doc_ref = db.collection('users').doc(uid);

          // Create snapshot of doc to read data
          const user_doc_snap = await user_doc_ref.get();

          // Step 2:
          // Grab the current recipients array

          if (user_doc_snap.exists) {
            // Get the data from the document snapshot
            const user_data = user_doc_snap.data();
            let current_recipients = user_data.recipients || [];
            
            // Check if the recipient exists
            const recipient_exists = current_recipients.some(recipient => recipient.recipient_id === recipient_id);

            if (recipient_exists) {
              // Step 3:
              // Remove the recipient from the array
              current_recipients = current_recipients.filter(recipient => recipient.recipient_id !== recipient_id);

              // Step 4:
              // Calculate the total recipients after removal
              const total_recipients = current_recipients.length;

              // Step 5:
              // Adjust the percentages to = 100% / total recipients

              if (total_recipients > 0) {
                // Calculate base percentage and distribute it
                const base_percentage = Math.ceil(100 / total_recipients);
                const percentages = Array(total_recipients).fill(base_percentage);

                // Adjust the last recipient's percentage to make the total 100%
                const total_base_percentage = base_percentage * total_recipients;
                const difference = total_base_percentage - 100;
                percentages[percentages.length - 1] -= difference;

                // Assign percentages to current recipients
                current_recipients.forEach((recipient, index) => {
                  recipient.percentage = percentages[index];
                });
              }

              // Update the document in Firestore
              await user_doc_ref.update({ recipients: current_recipients });

              // Step 6:
              // Send the data back to front end
              return res.status(200).send({ success: true, current_recipients });
            } else {
              return res.status(400).send({ error: 'Recipient not found' });
            }
          } else {
            return res.status(404).send({ error: 'User not found' });
          }
        } catch (error) {
          console.error('Error removing recipient:', error.message);
          res.status(500).send({ error: 'Error removing recipient' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(403).send('Unauthorized');
    }
  });
});

// Function returns recipient array to front end for matching user
exports.getRecipientsForUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await authenticate(req, res, async () => {
        try {
          // Extract uid from body
          const uid = req.body.uid;

          if (!uid) {
            return res.status(400).send({ error: 'Uid is required' });
          }

          // Step 1:
          // Find the user collection that matches uid

          // Create referene to matching doc
          const user_doc_ref = db.collection('users').doc(uid);

          // Create snapshot of doc to read data
          const user_doc_snap = await user_doc_ref.get();

          // Step 2:
          // Grab the current recipients array

          if (user_doc_snap.exists) {
            // Get the data from the document snapshot
            const user_data = user_doc_snap.data();
            const current_recipients = user_data.recipients || [];

            // Step 3:
            // Send the recipient array to the front end
            return res.status(200).send({ success: true, current_recipients });

          } else {
            return res.status(404).send({ error: 'User not found' });
          }
        } catch (error) {
          console.error('Error fetching recipient:', error.message);
          res.status(500).send({ error: 'Error fetching recipient' });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(403).send('Unauthorized');
    }
  });
});