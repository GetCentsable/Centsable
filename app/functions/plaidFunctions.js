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

// Middleware to verify Firebase ID tokens
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized');
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
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
          const response = await plaidClient.linkTokenCreate({
            user: {
              client_user_id: req.user.uid,
            },
            client_name: 'Centsable',
            products: [Products.Auth, Products.Transactions, Products.Balance, Products.Identity],
            country_codes: ['US'],
            language: 'en',
          });
          res.status(200).send(response.data);
        } catch (error) {
          console.error('Error creating link token:', error);
          res.status(500).send(error);
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(403).send('Unauthorized');
    }
  });
});
