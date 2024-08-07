const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const db = admin.firestore();

const generateDailyLogs = async () => {
  try {
    const dateToProcess = '2024-07-23'; // Set to the specific date you want to process
    console.log(`Processing transactions for date: ${dateToProcess}`);

    let totalRoundupAllUsers = 0;
    const userLogs = {}; // To store logs for each user

    // Fetch the existing daily log
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const dailyLogRef = holdingAccountRef.collection('daily_logs').doc(dateToProcess);
    const dailyLogDoc = await dailyLogRef.get();

    if (!dailyLogDoc.exists) {
      console.log(`No existing daily log found for ${dateToProcess}`);
      return;
    }

    const existingDailyLog = dailyLogDoc.data();

    // Iterate through each user in the existing daily log
    for (const userId in existingDailyLog) {
      if (userId === 'total_roundup_allUsers') continue; // Skip the total_roundup_allUsers field

      const userTotalRoundup = existingDailyLog[userId].total_roundup || 0;
      const userData = await db.collection('users').doc(userId).get();
      const userDistributions = [];

      console.log(`Processing user: ${userId} with total_roundup: ${userTotalRoundup}`);

      // Ensure recipients field exists and is an array
      if (userData.exists && Array.isArray(userData.data().recipients)) {
        let remainingRoundupAmount = parseFloat(userTotalRoundup.toFixed(2));
        let isFirstRecipient = true;

        // Distribute the roundup amount to recipients
        for (const recipient of userData.data().recipients) {
          let transferAmount = (userTotalRoundup * recipient.percentage) / 100;
          transferAmount = parseFloat(transferAmount.toFixed(2));

          if (isFirstRecipient) {
            // The first recipient gets any rounding differences
            transferAmount = remainingRoundupAmount;
            isFirstRecipient = false;
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
      } else {
        console.log(`No valid recipients found for user ${userId}`);
      }

      totalRoundupAllUsers += userTotalRoundup;

      // Store the user's log
      userLogs[userId] = {
        total_roundup: userTotalRoundup,
        distributions: userDistributions,
      };
    }

    // Update the final log with total_roundup_allUsers first
    const dailyLog = {
      total_roundup_allUsers: totalRoundupAllUsers,
      ...userLogs,
    };

    // Store the updated daily log back into Firestore
    await dailyLogRef.set(dailyLog, { merge: true });

    console.log(`Daily log for ${dateToProcess} updated successfully.`);
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
      .where(admin.firestore.FieldPath.documentId(), '>=', '2024-07-01') // Start of the month
      .where(admin.firestore.FieldPath.documentId(), '<=', '2024-07-31') // End of the month
      .get();

    let monthlyLog = {
      total_roundup_allUsers: 0,
      daily_logs: {}, // To store each daily log
    };

    dailyLogsSnapshot.forEach((dailyLogDoc) => {
      const logDate = dailyLogDoc.id;
      const dailyLogData = dailyLogDoc.data();

      // Process each user's log within the daily log
      for (const userId in dailyLogData) {
        if (userId === 'total_roundup_allUsers') continue; // Skip the total_roundup_allUsers field

        const userTotalRoundup = dailyLogData[userId].total_roundup || 0;
        const recipients = dailyLogData[userId].distributions || [];

        if (recipients.length > 0) {
          const baseAmount = parseFloat((userTotalRoundup / recipients.length).toFixed(2));
          let remainingAmount = userTotalRoundup;

          // Distribute the roundup amount to recipients
          recipients.forEach((recipient, index) => {
            let transferAmount = baseAmount;

            // Handle rounding differences by adding any remaining cents to the first recipient
            if (index === 0) {
              transferAmount += parseFloat((remainingAmount - baseAmount * recipients.length).toFixed(2));
            }

            remainingAmount -= transferAmount;

            // Update the recipient's transfer amount
            recipient.transfer_amount = transferAmount;
          });

          // Update the user log with the correct distributions
          dailyLogData[userId].distributions = recipients;
        }

        // Update total roundup for all users
        monthlyLog.total_roundup_allUsers += userTotalRoundup;

        // Include the processed daily log
        monthlyLog.daily_logs[logDate] = {
          ...dailyLogData,
        };
      }
    });

    // Store the monthly log in the holding account's monthly_logs subcollection
    const logRef = holdingAccountRef.collection('monthly_logs').doc('2024-07'); // Use the current month
    await logRef.set(monthlyLog);

    console.log(`Monthly log for 2024-07 created.`);
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
    const monthlyLogRef = holdingAccountRef.collection('monthly_logs').doc('2024-07'); // Use the correct month
    const monthlyLogDoc = await monthlyLogRef.get();

    if (!monthlyLogDoc.exists) {
      console.log(`Monthly log for 2024-07 not found.`);
      return;
    }

    const monthlyLogData = monthlyLogDoc.data();

    // Iterate through each daily log in the monthly log
    for (const logDate in monthlyLogData.daily_logs) {
      const dailyLog = monthlyLogData.daily_logs[logDate];

      // Iterate through each user's log within the daily log
      for (const userId in dailyLog) {
        if (userId !== 'total_roundup_allUsers') {
          const userLog = dailyLog[userId];

          // Adjust transfer amounts to avoid splitting pennies
          let totalTransferAmount = parseFloat(userLog.total_roundup.toFixed(2));
          let remainingAmount = totalTransferAmount;
          let isFirstRecipient = true;

          for (const [index, distribution] of userLog.distributions.entries()) {
            let transferAmount = (totalTransferAmount * distribution.percentage) / 100;
            transferAmount = parseFloat(transferAmount.toFixed(2));

            if (isFirstRecipient) {
              // The first recipient gets any rounding differences
              transferAmount = parseFloat(remainingAmount.toFixed(2));
              isFirstRecipient = false;
            } else {
              remainingAmount -= transferAmount;
            }

            distribution.transfer_amount = transferAmount;

            // Validate transfer_amount before proceeding
            if (isNaN(distribution.transfer_amount) || distribution.transfer_amount <= 0) {
              console.error(`Invalid transfer amount for recipient ${distribution.recipient_name} (user ${userId})`);
              continue;
            }

            // Process each recipient distribution for the user
            const recipientRef = db.collection('recipients').doc(distribution.recipient_id);

            // Update the recipient's money received
            await recipientRef.update({
              money_received: admin.firestore.FieldValue.increment(distribution.transfer_amount),
            });

            // Update the holding account balance and paid amount
            await holdingAccountRef.update({
              balance: admin.firestore.FieldValue.increment(-distribution.transfer_amount),
              paid: admin.firestore.FieldValue.increment(distribution.transfer_amount),
            });

            console.log(`Transferred ${distribution.transfer_amount} to ${distribution.recipient_name} for user ${userId}`);
          }
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
