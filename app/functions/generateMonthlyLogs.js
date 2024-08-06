const generateMonthlyLogs = async () => {
  try {
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const dailyLogsSnapshot = await holdingAccountRef.collection('daily_logs')
      .where('date', '>=', '2024-08-01') // Start of the month
      .where('date', '<=', '2024-08-31') // End of the month
      .get();

    let monthlyLog = {};

    dailyLogsSnapshot.forEach((dailyLogDoc) => {
      const dailyLogData = dailyLogDoc.data();

      // Aggregate data into the monthly log
      for (const userId in dailyLogData) {
        if (userId !== 'total_roundup_allUsers') {
          if (!monthlyLog[userId]) {
            monthlyLog[userId] = {
              total_roundup: 0,
              distributions: {},
            };
          }

          monthlyLog[userId].total_roundup += dailyLogData[userId].total_roundup;

          dailyLogData[userId].distributions.forEach((dist) => {
            if (!monthlyLog[userId].distributions[dist.recipient_id]) {
              monthlyLog[userId].distributions[dist.recipient_id] = {
                recipient_name: dist.recipient_name,
                transfer_amount: 0,
              };
            }
            monthlyLog[userId].distributions[dist.recipient_id].transfer_amount += dist.transfer_amount;
          });
        }
      }

      // Aggregate total roundup
      monthlyLog.total_roundup_allUsers = (monthlyLog.total_roundup_allUsers || 0) + dailyLogData.total_roundup_allUsers;
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
