const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { app } from 'firebase-admin';

const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const CalculateRoundups = async (userId, dateString) => {
  console.log(`Starting CalculateRoundups...\nuser_id: ${userId}, dateString: ${dateString}`);
  try {
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
        totalRoundup += parseFloat(transaction.round_up);
      }
    }
    console.log(`Total Roundup for ${dateString}: ${totalRoundup}`);
    return totalRoundup;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return 0;
  }
};

const updateBankAccount = async (userId, dateString, totalRoundup) => {
  try {
    const db = admin.firestore();
    const bankAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV'); //holding account

    await db.runTransaction(async (transaction) => {
      const bankAccountDoc = await transaction.get(bankAccountRef);
      const dailyLogRef = bankAccountRef.collection('daily_logs').doc(dateString);
      const dailyLogDoc = await transaction.get(dailyLogRef);

      if (!bankAccountDoc.exists) {
        throw new Error('Bank account document does not exist.');
      }

      const newBalance = (bankAccountDoc.data().balance || 0) + totalRoundup;
      const newReceived = (bankAccountDoc.data().received || 0) + totalRoundup;

      transaction.update(bankAccountRef, {
        balance: newBalance,
        received: newReceived,
      });
      console.log("balance and received updated");

      const userLog = {
        [`${userId}.total_roundup`]: totalRoundup
      };

      if (dailyLogDoc.exists) {
        transaction.update(dailyLogRef, userLog);
        console.log('daily_log updated');
      } else {
        transaction.set(dailyLogRef, { [userId]: { total_roundup: totalRoundup } });
        console.log('daily_log created');
      }
    });

    console.log(`Bank account updated with total_roundup: ${totalRoundup}`);
  } catch (error) {
    console.error('Error updating bank account:', error);
  }
};

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
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
        const totalRoundup = await CalculateRoundups(userId, dateString);

        if (totalRoundup === 0) {
          results.push({ userId, error: 'No transactions found or total roundup is zero.' });
          continue;
        }

        const roundToTenthRoundup = Math.round(totalRoundup * 100) / 100;

        // Update the bank account before creating the payment intent
        await updateBankAccount(userId, dateString, roundToTenthRoundup);

        const amountInCents = Math.round(roundToTenthRoundup * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
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
