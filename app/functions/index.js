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
const { getLinkedAccounts, getUserTransactions } = require('./frontendFunctions');
const { createLinkToken, exchangePublicToken, loadAllUserTransactions } = require('./plaidFunctions');
const { createPaymentIntent } = require('./stripeFunctions');
const { triggerDailyLogs, triggerMonthlyLogs, processMonthlyLog} = require('./recipientMoneyLogAndMove');


// Export the frontend functions
exports.getLinkedAccounts = getLinkedAccounts;
exports.getUserTransactions = getUserTransactions;

// Export Plaid functions for API request
exports.createLinkToken = createLinkToken;
exports.exchangePublicToken = exchangePublicToken;
exports.loadAllUserTransactions = loadAllUserTransactions;

// Export the stripe functions
exports.createPaymentIntent = createPaymentIntent;

// Export the Daily and Monthly Totals to Holding Account but not processed but also a function to process the monthly logs
exports.triggerDailyLogs = triggerDailyLogs
exports.triggerMonthlyLogs = triggerMonthlyLogs
exports.processMonthlyLog = processMonthlyLog
