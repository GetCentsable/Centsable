const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { app } from 'firebase-admin';
const cors = require('cors')({origin: true});

const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;

// REMOVE SECRET KEY FROM PUBLIC VIEW
const stripe = require("stripe")(STRIPE_SECRET_KEY);

// const calculateOrderAmount = async (items) => {
//   return 1995; // Fixed amount for this example
// };
async function calculateRoundups(userId, dateString) {
  try {
    // const db = getFirestore(app);
    const db = admin.firestore();
    const docRef = db.collection('users').doc(userId).collection('transactions').doc(dateString);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log(`No transactions found for ${dateString}`);
      return 0;
    }

    const data = doc.data();
    let totalRoundup = 0;

    // Iterate over the transaction fields
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const transaction = data[key];
        // Add the roundup_amount to the total, ensuring it's treated as a number
        totalRoundup += parseFloat(transaction.roundup_amount);
      }
    }

    return totalRoundup;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return 0;
  }
};

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const userId = 'd39WT9V0IWRIlKxbT6RIy1joZaT2';
      const dateString = 'August 2 2024';
      // const { items } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        // amount: calculateOrderAmount(items),
        amount: calculateRoundups(userId, dateString),
        currency: "usd",
      });
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});
