const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');

const db = admin.firestore();

// Function to transfer daily donations from holding account to recipients
const transferDailyDonations = async (userId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`User with ID ${userId} not found.`);
      return;
    }

    const userData = userDoc.data();
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const holdingAccountDoc = await holdingAccountRef.get();
    const holdingAccountData = holdingAccountDoc.data();

    let totalTransactionAmount = 0;
    const today = new Date();
    const dateString = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
    const transactionsRef = userRef.collection('transactions').doc(dateString);
    const transactionsDoc = await transactionsRef.get();

    if (transactionsDoc.exists) {
      const transactions = transactionsDoc.data();
      for (const transaction of Object.values(transactions)) {
        totalTransactionAmount += transaction.roundup_amount || 0;
      }
    }

    if (totalTransactionAmount > 0) {
      const dailyTransferLog = [];

      for (const recipient of userData.recipients) {
        const recipientRef = db.collection('recipients').doc(recipient.recipient_id);
        const recipientDoc = await recipientRef.get();

        if (recipientDoc.exists) {
          const transferAmount = (totalTransactionAmount * recipient.percentage) / 100;

          // Update the recipient's money received
          await recipientRef.update({
            money_received: admin.firestore.FieldValue.increment(transferAmount),
          });

          // Update the holding account balance and paid amount
          await holdingAccountRef.update({
            balance: admin.firestore.FieldValue.increment(-transferAmount),
            paid: admin.firestore.FieldValue.increment(transferAmount),
          });

          // Log the transaction in the daily transfer log
          dailyTransferLog.push({
            user_id: userId, // Include the user ID in the log
            recipient_id: recipient.recipient_id,
            recipient_name: recipient.recipient_name,
            amount: transferAmount
          });

          console.log(`Transferred ${transferAmount} from holding account to ${recipient.recipient_name} by user ${userId}`);
        }
      }

      // Log the daily transfers in the holding account's sub-collection
      const dailyLogRef = holdingAccountRef.collection('daily_transfers').doc(dateString);
      await dailyLogRef.set({
        date: today,
        transfers: dailyTransferLog // Store all transfers with user IDs
      });

      console.log(`Daily transfer log created for user ${userId} on ${dateString}`);
    } else {
      console.log(`No transactions to process for user ${userId} on ${dateString}`);
    }
  } catch (error) {
    console.error('Error transferring daily donations:', error);
  }
};

// Function to log transactions
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
  const usersSnapshot = await db.collection('users').get();
  
  usersSnapshot.forEach(doc => {
    const userId = doc.id;
    transferDailyDonations(userId);
  });

  res.status(200).send('Immediate transfer job completed');
});

// Schedule the transfer function to run at 0200 daily
/*
exports.scheduleDailyTransfer = functions.pubsub.schedule('2:00').timeZone('America/Chicago').onRun(async (context) => {
  const usersSnapshot = await db.collection('users').get();
  
  usersSnapshot.forEach(doc => {
    const userId = doc.id;
    transferDailyDonations(userId);
  });

  console.log('Daily transfer job completed');
});
*/

