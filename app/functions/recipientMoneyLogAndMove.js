const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const db = admin.firestore(); // Initialize Firestore

const generateDailyLogs = async () => {
  try {
    const dateStrings = [
      '2024-05-01',
      '2024-05-02',
      '2024-05-03',
      '2024-05-04',
      '2024-05-05',
      '2024-05-06',
      '2024-05-07',
      '2024-05-08',
      '2024-05-09',
      '2024-05-10',
      '2024-05-11',
      '2024-05-12',
      '2024-05-13',
      '2024-05-14',
      '2024-05-15',
      '2024-05-16',
      '2024-05-17',
      '2024-05-18',
      '2024-05-19',
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

    for (const dateToProcess of dateStrings) {
      console.log(`Processing transactions for date: ${dateToProcess}`);

      let totalRoundupAllUsers = 0;
      const userLogs = {}; // To store logs for each user

      // Fetch the existing daily log
      const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
      const dailyLogRef = holdingAccountRef.collection('daily_logs').doc(dateToProcess);
      const dailyLogDoc = await dailyLogRef.get();

      if (!dailyLogDoc.exists) {
        console.log(`No existing daily log found for ${dateToProcess}`);
        continue;
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
          const recipients = userData.data().recipients;
          const baseAmount = parseFloat((userTotalRoundup / recipients.length).toFixed(2));
          let remainingAmount = userTotalRoundup;

          // Distribute the roundup amount to recipients
          recipients.forEach((recipient, index) => {
            let transferAmount = baseAmount;

            // The first recipient gets any remaining cents
            if (index === 0) {
              transferAmount += parseFloat((remainingAmount - baseAmount * recipients.length).toFixed(2));
            }

            remainingAmount -= transferAmount;

            // Add to the user's distribution log
            userDistributions.push({
              recipient_id: recipient.recipient_id,
              recipient_name: recipient.recipient_name,
              transfer_amount: transferAmount,
            });
          });
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
    }
  } catch (error) {
    console.error('Error generating daily logs:', error);
  }
};

// Function to trigger the generation of daily logs
exports.triggerDailyLogs = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await generateDailyLogs();
    res.status(200).send('Daily logs generated successfully');
  });
});


///////////////////////////////////////////////////////////////////////////////////////////

const generateMonthlyLogs = async () => {
  try {
    const dateRanges = [
      { start: '2024-05-01', end: '2024-05-31' },
      { start: '2024-06-01', end: '2024-06-30' },
      { start: '2024-07-01', end: '2024-07-31' },
      { start: '2024-08-01', end: '2024-08-31' }
    ];

    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');

    for (const range of dateRanges) {
      const { start, end } = range;

      const dailyLogsSnapshot = await holdingAccountRef.collection('daily_logs')
        .where(admin.firestore.FieldPath.documentId(), '>=', start)
        .where(admin.firestore.FieldPath.documentId(), '<=', end)
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

              // The first recipient gets any remaining cents
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
      const monthName = start.slice(0, 7); // Extract the year and month (e.g., '2024-05')
      const logRef = holdingAccountRef.collection('monthly_logs').doc(monthName);
      await logRef.set(monthlyLog);

      console.log(`Monthly log for ${monthName} created.`);
    }
  } catch (error) {
    console.error('Error generating monthly logs:', error);
  }
};

// Function to trigger the generation of monthly logs
exports.triggerMonthlyLogs = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await generateMonthlyLogs();
    res.status(200).send('Monthly logs generated successfully');
  });
});


///////////////////////////////////////////////////////////////////////////////////////////

const processMonthlyLog = async (months) => {
  try {
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');

    for (const month of months) {
      const monthlyLogRef = holdingAccountRef.collection('monthly_logs').doc(month);
      const monthlyLogDoc = await monthlyLogRef.get();

      if (!monthlyLogDoc.exists) {
        console.log(`Monthly log for ${month} not found.`);
        continue;
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
    }

    console.log('Monthly log processing completed.');
  } catch (error) {
    console.error('Error processing monthly logs:', error);
  }
};

// Function to trigger the processing of monthly logs
exports.processMonthlyLog = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { months } = req.body;
    if (!months || !Array.isArray(months) || months.length === 0) {
      return res.status(400).send({ error: 'Invalid months selection' });
    }
    await processMonthlyLog(months);
    res.status(200).send('Monthly log processing completed successfully');
  });
});
