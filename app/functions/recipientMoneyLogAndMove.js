const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const db = admin.firestore();

const generateDailyLogs = async () => {
  try {
    const dateToProcess = '2024-08-05'; // Replace with new Date().toISOString().split('T')[0] for current date
    console.log(`Processing transactions for date: ${dateToProcess}`);

    let totalRoundupAllUsers = 0;
    const userLogs = {}; // To store logs for each user

    const usersSnapshot = await db.collection('users').get();
    console.log(`Total users found: ${usersSnapshot.size}`);

    // Iterate through each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      let userTotalRoundup = 0;
      const userDistributions = [];

      console.log(`Processing user: ${userId}`);

      // Get the transactions for the specific date
      const transactionsSnapshot = await userDoc.ref
        .collection('transactions')
        .doc(dateToProcess)
        .get();

      if (transactionsSnapshot.exists) {
        console.log(`Transactions found for user ${userId} on ${dateToProcess}`);

        const transactionsData = transactionsSnapshot.data();
        for (const [transactionId, transaction] of Object.entries(transactionsData)) {
          const roundupAmount = Math.abs(transaction.amount - Math.floor(transaction.amount)); // Calculate roundup
          userTotalRoundup += roundupAmount;
        }

        // Distribute the roundup amount to recipients
        let remainingRoundupAmount = userTotalRoundup;
        for (const recipient of userData.recipients) {
          const recipientRef = db.collection('recipients').doc(recipient.recipient_id);
          const recipientDoc = await recipientRef.get();

          if (recipientDoc.exists) {
            let transferAmount = (userTotalRoundup * recipient.percentage) / 100;

            // Handle rounding errors by ensuring the last recipient gets any leftover amount
            if (recipient === userData.recipients[userData.recipients.length - 1]) {
              transferAmount = remainingRoundupAmount;
            } else {
              remainingRoundupAmount -= transferAmount;
            }

            // Add to the user's distribution log
            userDistributions.push({
              recipient_id: recipient.recipient_id,
              recipient_name: recipient.recipient_name,
              transfer_amount: transferAmount,
            });
          }
        }

        totalRoundupAllUsers += userTotalRoundup;

        // Store the user's log
        userLogs[userId] = {
          total_roundup: userTotalRoundup,
          distributions: userDistributions,
        };
      } else {
        console.log(`No transactions found for user ${userId} on ${dateToProcess}`);
      }
    }

    // Create the final log with total_roundup_allUsers first
    const dailyLog = {
      total_roundup_allUsers: totalRoundupAllUsers,
      ...userLogs,
    };

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


///////////////////////////////////////////////////////////////////////////////////////////

const generateMonthlyLogs = async () => {
  try {
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const dailyLogsSnapshot = await holdingAccountRef.collection('daily_logs')
      .where(admin.firestore.FieldPath.documentId(), '>=', '2024-08-01') // Start of the month
      .where(admin.firestore.FieldPath.documentId(), '<=', '2024-08-31') // End of the month
      .get();

    let monthlyLog = {
      daily_logs: {}, // To store each daily log
      total_roundup_allUsers: 0,
    };

    dailyLogsSnapshot.forEach((dailyLogDoc) => {
      const logDate = dailyLogDoc.id;
      const dailyLogData = dailyLogDoc.data();

      // Include only the relevant daily log data without duplicating user information
      monthlyLog.daily_logs[logDate] = {
        ...dailyLogData,
      };

      // Aggregate total roundup for all users
      monthlyLog.total_roundup_allUsers += dailyLogData.total_roundup_allUsers || 0;
    });

    // Store the monthly log in the holding account's monthly_logs subcollection
    const logRef = holdingAccountRef.collection('monthly_logs').doc('2024-08'); // Use the current month
    await logRef.set(monthlyLog);

    console.log(`Monthly log for 2024-08 created.`);
  } catch (error) {
    console.error('Error generating monthly logs:', error);
  }
};

// Function to trigger the generation of monthly logs
exports.triggerMonthlyLogs = functions.https.onRequest(async (req, res) => {
  await generateMonthlyLogs();
  res.status(200).send('Monthly logs generated successfully');
});


///////////////////////////////////////////////////////////////////////////////////////////

const processMonthlyLog = async () => {
  try {
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const monthlyLogRef = holdingAccountRef.collection('monthly_logs').doc('2024-08'); // Use the current month
    const monthlyLogDoc = await monthlyLogRef.get();

    if (!monthlyLogDoc.exists) {
      console.log(`Monthly log for 2024-08 not found.`);
      return;
    }

    const monthlyLogData = monthlyLogDoc.data();

    for (const userId in monthlyLogData) {
      if (userId !== 'total_roundup_allUsers') {
        const userLog = monthlyLogData[userId];

        for (const recipientId in userLog.distributions) {
          const recipientData = userLog.distributions[recipientId];

          // Update the recipient's money received
          const recipientRef = db.collection('recipients').doc(recipientId);
          await recipientRef.update({
            money_received: admin.firestore.FieldValue.increment(recipientData.transfer_amount),
          });

          // Update the holding account balance and paid amount
          await holdingAccountRef.update({
            balance: admin.firestore.FieldValue.increment(-recipientData.transfer_amount),
            paid: admin.firestore.FieldValue.increment(recipientData.transfer_amount),
          });

          console.log(`Transferred ${recipientData.transfer_amount} to ${recipientData.recipient_name}`);
        }
      }
    }

    console.log('Monthly log processing completed.');
  } catch (error) {
    console.error('Error processing monthly logs:', error);
  }
};

// Function to trigger the processing of monthly logs
exports.processMonthlyLog = functions.https.onRequest(async (req, res) => {
  await processMonthlyLog();
  res.status(200).send('Monthly log processing completed successfully');
});
