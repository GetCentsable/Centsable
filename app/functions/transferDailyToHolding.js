const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');

const db = admin.firestore();

const generateDailyLogs = async () => {
  try {
    const dateToProcess = '2024-08-05'; // Replace with new Date().toISOString().split('T')[0] for current date
    console.log(`Processing transactions for date: ${dateToProcess}`);

    let totalRoundupAllUsers = 0;
    const dailyLog = {}; // To store the log for each user

    const usersSnapshot = await db.collection('users').get();
    console.log(`Total users found: ${usersSnapshot.size}`);

    // Iterate through each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      let userTotalRoundup = 0;
      const userDistributions = [];

      console.log(`Processing user: ${userId}`);

      const transactionsSnapshot = await userDoc.ref
        .collection('transactions')
        .where('date', '==', dateToProcess)
        .get();

      if (!transactionsSnapshot.empty) {
        console.log(`Transactions found for user ${userId} on ${dateToProcess}`);

        transactionsSnapshot.forEach((transactionDoc) => {
          const transaction = transactionDoc.data();
          const roundupAmount = Math.abs(transaction.amount - Math.floor(transaction.amount)); // Calculate roundup
          userTotalRoundup += roundupAmount;
        });

        // Distribute the roundup amount to recipients
        for (const recipient of userData.recipients) {
          const recipientRef = db.collection('recipients').doc(recipient.recipient_id);
          const recipientDoc = await recipientRef.get();

          if (recipientDoc.exists) {
            const transferAmount = (userTotalRoundup * recipient.percentage) / 100;

            // Add to the user's distribution log
            userDistributions.push({
              recipient_id: recipient.recipient_id,
              recipient_name: recipient.recipient_name,
              transfer_amount: transferAmount,
            });
          }
        }

        totalRoundupAllUsers += userTotalRoundup;

        // Store the user's log in the daily log
        dailyLog[userId] = {
          total_roundup: userTotalRoundup,
          distributions: userDistributions,
        };
      } else {
        console.log(`No transactions found for user ${userId} on ${dateToProcess}`);
      }
    }

    // Add total roundup for all users to the log
    dailyLog.total_roundup_allUsers = totalRoundupAllUsers;

    // Store the daily log in the holding account's daily_logs subcollection
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const logRef = holdingAccountRef.collection('daily_logs').doc(dateToProcess);
    await logRef.set(dailyLog);

    console.log(`Daily log for ${dateToProcess} created.`);
  } catch (error) {
    console.error('Error generating daily logs:', error);
  }
};

// Function to trigger the generation of daily logs
exports.triggerDailyLogs = functions.https.onRequest(async (req, res) => {
  await generateDailyLogs();
  res.status(200).send('Daily logs generated successfully');
});
