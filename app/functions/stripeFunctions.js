const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const dateStrings = [
  '2024-05-20',
  '2024-05-21',
  '2024-05-22',
  '2024-05-23',
  '2024-05-24',
  '2024-05-25',
  '2024-05-26',
  '2024-05-27',
  '2024-05-28',
  '2024-05-29',
  '2024-05-30',
  '2024-05-31',
  '2024-06-01',
  '2024-06-02',
  '2024-06-03',
  '2024-06-04',
  '2024-06-05',
  '2024-06-06',
  '2024-06-07',
  '2024-06-08',
  '2024-06-09',
  '2024-06-10',
  '2024-06-11',
  '2024-06-12',
  '2024-06-13',
  '2024-06-14',
  '2024-06-15',
  '2024-06-16',
  '2024-06-17',
  '2024-06-18',
  '2024-06-19',
  '2024-06-20',
  '2024-06-21',
  '2024-06-22',
  '2024-06-23',
  '2024-06-24',
  '2024-06-25',
  '2024-06-26',
  '2024-06-27',
  '2024-06-28',
  '2024-06-29',
  '2024-06-30',
  '2024-07-01',
  '2024-07-02',
  '2024-07-03',
  '2024-07-04',
  '2024-07-05',
  '2024-07-06',
  '2024-07-07',
  '2024-07-08',
  '2024-07-09',
  '2024-07-10',
  '2024-07-11',
  '2024-07-12',
  '2024-07-13',
  '2024-07-14',
  '2024-07-15',
  '2024-07-16',
  '2024-07-17',
  '2024-07-18',
  '2024-07-19',
  '2024-07-20',
  '2024-07-21',
  '2024-07-22',
  '2024-07-23',
  '2024-07-24',
  '2024-07-25',
  '2024-07-26',
  '2024-07-27',
  '2024-07-28',
  '2024-07-29',
  '2024-07-30',
  '2024-07-31',
  '2024-08-01',
  '2024-08-02',
  '2024-08-03',
  '2024-08-04',
  '2024-08-05',
  '2024-08-06',
  '2024-08-07',
  '2024-08-08',
  '2024-08-09'
];

// This function looks at all the users transactions for a date and adds up all the rounded up change values
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
    // console.log(`Total Roundup for ${dateString}: ${totalRoundup}`);
    return totalRoundup;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return 0;
  }
};

// This function updates the holding account and centsable account with the money paid by users and adds daily logs
const updateBankAccount = async (userId, dateString, totalRoundup) => {
  console.log(`Starting updateBankAccount...\nuser_id: ${userId}, dateString: ${dateString}, totalRoundup: ${totalRoundup}`);
  try {
    const db = admin.firestore();
    const centsableAccountRef = db.collection('bank_accounts').doc('Qz9dVjodzi7S8IAfIQdU');
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');

    await db.runTransaction(async (transaction) => {
      const centsableAccountDoc = await transaction.get(centsableAccountRef);
      const holdingAccountDoc = await transaction.get(holdingAccountRef);
      const dailyLogRef = holdingAccountRef.collection('daily_logs').doc(dateString);
      const dailyLogDoc = await transaction.get(dailyLogRef);

      if (!centsableAccountDoc.exists) {
        throw new Error('Centsable account document does not exist.');
      }
      if (!holdingAccountDoc.exists) {
        throw new Error('Holding account document does not exist.');
      }

      const centsableCut = totalRoundup / 20;
      const recipientsCut = totalRoundup - centsableCut;
      const roundRecipientCut = Math.floor(recipientsCut * 100) / 100;

      // console.log(`holdingAccountDoc.data().balance pre +roundup: ${holdingAccountDoc.data().balance}`);
      // console.log(`holdingAccountDoc.data().received pre +roundup: ${holdingAccountDoc.data().received}`);
      const newCentsableBalance = (centsableAccountDoc.data().balance || 0) + centsableCut;
      const newCentsableReceived = (centsableAccountDoc.data().received || 0) + centsableCut;
      const newHoldingBalance = (holdingAccountDoc.data().balance || 0) + recipientsCut;
      const newHoldingReceived = (holdingAccountDoc.data().received || 0) + recipientsCut;
      // console.log(`newBalance post +roundup: ${newBalance}`);
      // console.log(`newReceived post +roundup: ${newBalance}`);
      const roundCentsableBalance = Math.floor(newCentsableBalance * 100) / 100;
      const roundCentsableReceived = Math.floor(newCentsableReceived * 100) / 100;
      const roundHoldingBalance = Math.floor(newHoldingBalance * 100) / 100;
      const roundHoldingReceived = Math.floor(newHoldingReceived * 100) / 100;
      // console.log(`roundNewBalance post math.floor: ${roundNewBalance}`);
      // console.log(`roundNewReceived post math.floor: ${roundNewReceived}`);

      transaction.update(centsableAccountRef, {
        balance: roundCentsableBalance,
        received: roundCentsableReceived,
      });
      transaction.update(holdingAccountRef, {
        balance: roundHoldingBalance,
        received: roundHoldingReceived,
      });

      const userLog = {
        [`${userId}.total_roundup`]: roundRecipientCut
      };

      if (dailyLogDoc.exists) {
        transaction.update(dailyLogRef, userLog);
      } else {
        transaction.set(dailyLogRef, { [userId]: { total_roundup: totalRoundup } });
      }
    });

    // console.log(`Bank account updated with total_roundup: ${totalRoundup}`);
  } catch (error) {
    console.error('Error updating bank account:', error);
  }
};

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { content } = req.body;
      if (!content || !Array.isArray(content) || content.length === 0) {
        return res.status(400).send({ error: 'Invalid content' });
      }

      const results = [];

      // Iterate over each entry in the content array
      for (const entry of content) {
        const userFromRequest = entry.user || null;
        const dateFromRequest = entry.date || null;

        console.log(`Processing user: ${userFromRequest}, date: ${dateFromRequest}`);

        // Fetch all users if no user is provided
        const db = admin.firestore();
        const usersSnapshot = await db.collection('users').get();
        const allUsers = usersSnapshot.docs.map(doc => doc.id);

        // Determine the dates to check
        const datesToCheck = dateFromRequest ? [dateFromRequest] : dateStrings;
        const userIdsToCheck = userFromRequest ? [userFromRequest] : allUsers;

        // Process each date and user combination
        for (const date of datesToCheck) {
          for (const userId of userIdsToCheck) {
            const totalRoundup = await CalculateRoundups(userId, date);

            if (totalRoundup === 0) {
              results.push({ user: userId, date, error: 'No transactions found or total roundup is zero.' });
              continue;
            }
            if (totalRoundup < 0.5) {
              results.push({ user: userId, date, error: 'Total roundup is less than $0.50.' });
              continue;
            }

            // Update the bank account before creating the payment intent
            await updateBankAccount(userId, date, totalRoundup);

            const amountInCents = Math.round(totalRoundup * 100);
            const paymentIntent = await stripe.paymentIntents.create({
              amount: amountInCents,
              currency: "usd",
            });

            results.push({ user: userId, clientSecret: paymentIntent.client_secret, date });
            console.log(`Payment intent created for user ${userId} on date ${date}`);
          }
        }
      }

      res.status(200).send(results);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});



// exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     try {
//       // const dateString = '2024-07-23';
//       const db = admin.firestore();
//       const usersSnapshot = await db.collection('users').get();

//       if (usersSnapshot.empty) {
//         console.log('No users found.');
//         return res.status(400).send({ error: 'No users found.' });
//       }

//       const results = [];
//       for (const dateString of dateStrings) {
//         for (const userDoc of usersSnapshot.docs) {
//           const userId = userDoc.id;
//           const totalRoundup = await CalculateRoundups(userId, dateString);
  
//           if (totalRoundup === 0) {
//             results.push({ userId, error: 'No transactions found or total roundup is zero.' });
//             continue;
//           }
//           if (totalRoundup < 0.5) {
//             results.push({ userId, error: 'Total roundup is less than $0.50.' });
//             continue;
//           }
  
//           // console.log(`totalRoundup pre tenthrounding: ${totalRoundup}`);
//           const roundToTenthRoundup = Math.round(totalRoundup * 100) / 100;
//           // console.log(`roundToTenthRoundup post tenthrounding: ${roundToTenthRoundup}`);
  
//           // Update the bank account before creating the payment intent
//           await updateBankAccount(userId, dateString, roundToTenthRoundup);
  
//           const amountInCents = Math.round(roundToTenthRoundup * 100);
//           const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: "usd",
//           });
  
//           results.push({ userId, clientSecret: paymentIntent.client_secret });
//           console.log(`Payment intent created for user ${userId} on date ${dateString}`);
//         }
//       }

//       res.status(200).send(results);
//     } catch (error) {
//       res.status(500).send({ error: error.message });
//     }
//   });
// });
