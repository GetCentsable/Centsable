/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// This is all the functions need to be in a constant for the deployment to work
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Import the functions from the other files
const { getLinkedAccounts } = require('./frontendFunctions');
const { createLinkToken, exchangePublicToken, loadAllUserTransactions } = require('./plaidFunctions');
const { createPaymentIntent } = require('./stripeFunctions');
const { triggerDailyLogs} = require('./transferDailyToHolding');
const { triggerMonthlyLogs } = require('./generateMonthlyLogs');
const { processMonthlyLog } = require('./transferToRecipients');

// Export the frontend functions
exports.getLinkedAccounts = getLinkedAccounts;

// Export Plaid functions for API request
exports.createLinkToken = createLinkToken;
exports.exchangePublicToken = exchangePublicToken;
exports.loadAllUserTransactions = loadAllUserTransactions;

// Export the stripe functions
exports.createPaymentIntent = createPaymentIntent;

// Export the Daily Totals to Holding Account but not processed
exports.triggerDailyLogs = triggerDailyLogs

// Export the Monthly Totals to Holding Account but not processed
exports.triggerMonthlyLogs = triggerMonthlyLogs

// Export the Monthly Totals to Holding Account and proccessed it to the recipients
exports.processMonthlyLog = processMonthlyLog
