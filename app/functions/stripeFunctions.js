const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { app } from 'firebase-admin';
const cors = require('cors')({origin: true});

const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;

// REMOVE SECRET KEY FROM PUBLIC VIEW
const stripe = require("stripe")(STRIPE_SECRET_KEY);

// ROUND UP VERSION -----------------------------------------------------------------------------------------

const CalculateRoundups = async (userId, dateString) => {
  console.log(`Starting CalculateRoundups...\nuser_id: ${userId}, dateString: ${dateString}`);
  try {
    console.log('Starting try block');
    // const db = getFirestore(app);
    const db = admin.firestore();
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
      console.log(`key: ${key}`);
      console.log(`forloop, total roundup: ${totalRoundup}`);
      if (data.hasOwnProperty(key)) {
        const transaction = data[key];
        console.log(`transaction: ${transaction}`);
        console.log(`transaction roundup amount: ${transaction.amount}`);
        // Add the roundup_amount to the total, ensuring it's treated as a number
        totalRoundup += parseFloat(transaction.amount);
      }
    }
    console.log(`Total Roundup for ${dateString}: ${totalRoundup}`);
    return totalRoundup;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return 0;
  }
};

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  console.log('createpayment intent outside cors');
  cors(req, res, async () => {
    try {
      const userId = 'k3t0Mlx7QbbAmMwyZf8ruJPmdxG2';
      const dateString = '2024-07-23';
      console.log(`Starting create payment intent...\nuser_id: ${userId}, dateString: ${dateString}`);

      const totalRoundup = await CalculateRoundups(userId, dateString);
      console.log(`Total Roundup Calculated: ${totalRoundup}`);

      if (totalRoundup === 0) {
        return res.status(400).send({ error: 'No transactions found or total roundup is zero.' });
      }


      const amountInCents = Math.round(totalRoundup * 100);

      console.log(`Amount in Cents: ${amountInCents}`);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,

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

