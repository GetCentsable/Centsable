const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');

const db = admin.firestore();

// Function to transfer weekly donations from holding account to recipients
const transferWeeklyDonations = async () => {
  try {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7); // 7 days ago

    const dateString = `${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`; // Date range for the log
    console.log(`Processing transactions for date range: ${dateString}`);

    let totalRoundupAllUsers = 0; // Initialize total roundup for all users
    const weeklyLog = {}; // To store the log for each user

    const usersSnapshot = await db.collection('users').get();

    // Loop through each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      let userTotalRoundup = 0;

      // Loop through the past 7 days
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const transactionsRef = userDoc.ref.collection('transactions').doc(dateString);
        const transactionsDoc = await transactionsRef.get();

        if (transactionsDoc.exists) {
          const transactions = transactionsDoc.data();
          // Sum up the roundup amounts from all transactions for this day
          for (const transaction of Object.values(transactions)) {
            userTotalRoundup += transaction.roundup_amount || 0;
          }
        }
      }

      // If the user has roundup to distribute
      if (userTotalRoundup > 0) {
        const userLog = {
          total_roundup: userTotalRoundup,
          distributions: [],
        };

        totalRoundupAllUsers += userTotalRoundup;

        // Distribute the roundup amount to recipients
        for (const recipient of userData.recipients) {
          const recipientRef = db.collection('recipients').doc(recipient.recipient_id);
          const recipientDoc = await recipientRef.get();

          if (recipientDoc.exists) {
            const transferAmount = (userTotalRoundup * recipient.percentage) / 100;

            // Update the recipient's money received
            await recipientRef.update({
              money_received: admin.firestore.FieldValue.increment(transferAmount),
            });

            // Update the holding account balance and paid amount
            await db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV').update({
              balance: admin.firestore.FieldValue.increment(-transferAmount),
              paid: admin.firestore.FieldValue.increment(transferAmount),
            });

            // Log the transaction for the recipient
            await logTransaction(userId, recipient.recipient_id, transferAmount, 'debit');

            console.log(`Transferred ${transferAmount} from holding account to ${recipientDoc.data().name}`);

            // Add to the user's log
            userLog.distributions.push({
              recipient_id: recipient.recipient_id,
              recipient_name: recipientDoc.data().name,
              transfer_amount: transferAmount,
            });
          }
        }

        // Store the user's log in the weekly log
        weeklyLog[userId] = userLog;
      }
    }

    // Store the total roundup for all users in the weekly log
    weeklyLog.total_roundup_allUsers = totalRoundupAllUsers;

    // Store the weekly log in the holding account's weekly_logs collection
    const logRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV').collection('weekly_logs').doc(dateString);
    await logRef.set(weeklyLog);

    console.log(`Weekly log for ${dateString} created.`);
  } catch (error) {
    console.error('Error transferring weekly donations:', error);
  }
};

// Function to log individual transactions
const logTransaction = async (userId, recipientId, amount, type = 'debit') => {
  const transactionRef = db.collection('transactions').doc();
  await transactionRef.set({
    user_id: userId,
    recipient_id: recipientId,
    amount: amount,
    type: type,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    status: 'completed'
  });
  console.log(`Transaction logged: ${type} - User ${userId} ${amount} to recipient ${recipientId}`);
};

// Function to trigger the transfer immediately for testing
exports.triggerImmediateTransfer = functions.https.onRequest(async (req, res) => {
  await transferWeeklyDonations();
  res.status(200).send('Immediate weekly transfer job completed');
});
