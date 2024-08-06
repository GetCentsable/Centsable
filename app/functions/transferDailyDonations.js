const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');

const db = admin.firestore();

// Function to transfer daily donations from holding account to recipients
const transferDailyDonations = async (userId) => {
  try {
    // Reference to the user document in Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    // Check if the user exists
    if (!userDoc.exists) {
      console.error(`User with ID ${userId} not found.`);
      return;
    }

    const userData = userDoc.data(); // Retrieve user data
    const holdingAccountRef = db.collection('bank_accounts').doc('TEBGHPGaGH8imJTyeasV');
    const holdingAccountDoc = await holdingAccountRef.get(); // Get holding account data

    let totalTransactionAmount = 0; // Initialize total transaction amount
    const dateString = 'August 5 2024'; // Hardcoded date for processing transactions
    console.log(`Processing transactions for date: ${dateString}`);
    
    // Reference to the user's transactions for the specified date
    const transactionsRef = userRef.collection('transactions').doc(dateString);
    const transactionsDoc = await transactionsRef.get();

    // Check if there are any transactions for the specified date
    if (transactionsDoc.exists) {
      console.log(`Transactions found for user ${userId} on ${dateString}`);
      const transactions = transactionsDoc.data(); // Retrieve transaction data
      // Sum up the roundup amounts from all transactions
      for (const [transactionId, transaction] of Object.entries(transactions)) {
        console.log(`Processing transaction ${transactionId} with roundup_amount: ${transaction.roundup_amount}`);
        totalTransactionAmount += transaction.roundup_amount || 0;
      }
    } else {
      console.log(`No transactions document found for user ${userId} on ${dateString}`);
    }

    // If there is a total transaction amount to process
    if (totalTransactionAmount > 0) {
      const dailyLog = {
        user_id: userId,
        date: dateString, // Date of the transactions
        total_roundup_allUsers: totalTransactionAmount, // Total roundup amount
        distributions: [], // Array to store distribution details
      };

      // Loop through each recipient and distribute the funds accordingly
      for (const recipient of userData.recipients) {
        const recipientRef = db.collection('recipients').doc(recipient.recipient_id);
        const recipientDoc = await recipientRef.get();

        // Check if the recipient exists
        if (recipientDoc.exists) {
          // Calculate the amount to transfer based on the recipient's percentage
          const transferAmount = (totalTransactionAmount * recipient.percentage) / 100;

          // Update the recipient's received money
          await recipientRef.update({
            money_received: admin.firestore.FieldValue.increment(transferAmount),
          });

          // Update the holding account balance and paid amount
          await holdingAccountRef.update({
            balance: admin.firestore.FieldValue.increment(-transferAmount),
            paid: admin.firestore.FieldValue.increment(transferAmount),
          });

          // Log the transaction for the recipient
          await logTransaction(userId, recipient.recipient_id, transferAmount, 'debit');

          console.log(`Transferred ${transferAmount} from holding account to ${recipientDoc.data().name}`);

          // Add the distribution details to the daily log
          dailyLog.distributions.push({
            recipient_id: recipient.recipient_id,
            recipient_name: recipientDoc.data().name,
            transfer_amount: transferAmount,
          });
        }
      }

      // Store the daily log in the holding account's daily_logs collection
      const logRef = holdingAccountRef.collection('daily_logs').doc(dateString);
      await logRef.set(dailyLog);

      console.log(`Daily log for ${dateString} created for user ${userId}`);
    } else {
      console.log(`No transactions to process for user ${userId} on ${dateString}`);
    }
  } catch (error) {
    console.error('Error transferring daily donations:', error);
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
  const usersSnapshot = await db.collection('users').get();
  
  // Loop through each user and process their transactions
  usersSnapshot.forEach(doc => {
    const userId = doc.id;
    transferDailyDonations(userId);
  });

  res.status(200).send('Immediate transfer job completed');
});
