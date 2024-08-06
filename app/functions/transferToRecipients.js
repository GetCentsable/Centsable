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
