const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
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
            // Create user ref
            const userRef = db.collection('users').doc(uid);

            // Update the user doc with the access token
            await userRef.set({
              plaid_token: ACCESS_TOKEN,
              itemId: ITEM_ID
            }, { merge: true});

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
