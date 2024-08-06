const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { app } from 'firebase-admin';

const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;
const stripe = require("stripe")(STRIPE_SECRET_KEY);


const CalculateRoundups = async (userId, dateString) => {
  console.log(`Starting CalculateRoundups...\nuser_id: ${userId}, dateString: ${dateString}`);
  try {
    console.log('Starting try block');
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
      const dateString = '2024-07-23';
      const db = admin.firestore();
      const usersSnapshot = await db.collection('users').get();

      if (usersSnapshot.empty) {
        console.log('No users found.');
        return res.status(400).send({ error: 'No users found.' });
      }

      const results = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const username = userDoc.username;
        const totalRoundup = await CalculateRoundups(userId, dateString);

        if (totalRoundup === 0) {
          results.push({ userId, error: 'No transactions found or total roundup is zero.' });
          continue;
        }

        const amountInCents = Math.round(totalRoundup * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
          customer: username
        });

        results.push({ userId, clientSecret: paymentIntent.client_secret });
        console.log(`Payment intent created for user ${userId}`);
      }

      res.status(200).send(results);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});

