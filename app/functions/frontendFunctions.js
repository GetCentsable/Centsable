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
