const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { app } from 'firebase-admin';
const cors = require('cors')({origin: true});

const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;

// REMOVE SECRET KEY FROM PUBLIC VIEW
const stripe = require("stripe")(STRIPE_SECRET_KEY);

// ROUND UP VERSION -----------------------------------------------------------------------------------------

const  CalculateRoundups = async (userId, dateString) => {
  console.log(`Starting CalculateRoundups...\nuser_id: ${userId}, dateString: ${dateString}`);
  try {
    console.log('Starting try block');
    const db = getFirestore(app);
    // const db = admin.firestore();
    console.log('db acquired');
    const docRef = db.collection('users').doc(userId).collection('transactions').doc(dateString);
    console.log('doc reffed');
    const doc = await docRef.get();
    console.log('docref.get awaited');

    if (!doc.exists) {
      console.log(`No transactions found for ${dateString}`);
      return 0;
    }
    console.log('doc exists');

    const data = doc.data();
    let totalRoundup = 0;

    // Iterate over the transaction fields
    for (const key in data) {
      console.log(`forloop, total roundup: ${totalRoundup}`);
      if (data.hasOwnProperty(key)) {
        const transaction = data[key];
        console.log(`transaction: ${transaction}`);
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
      console.log(`Starting create payment intent...\nuser_id: ${userId}, dateString: ${dateString}`);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: CalculateRoundups(userId, dateString),
        currency: "usd",
      });
      console.log('payment intent created');
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});


// STARTER VERSION -----------------------------------------------------------------------------

// const calculateOrderAmount = (items) => {
//   return 98765; // Fixed amount for this example
// };

// exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     try {
//       const { items } = req.body;
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: calculateOrderAmount(items),
//         currency: "usd",
//       });
//       console.log('payment intent created');
  
//       res.status(200).send({
//         clientSecret: paymentIntent.client_secret,
//       });
//     } catch (error) {
//       res.status(500).send({ error: error.message });
//     }
//   });
// });