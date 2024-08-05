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
const { createLinkToken, exchangePublicToken } = require('./plaidFunctions');
const { createPaymentIntent } = require('./stripeFunctions');
const { triggerImmediateTransfer, scheduleDailyTransfer } = require('./transferDailyDonations');

// Export the frontend functions
exports.getLinkedAccounts = getLinkedAccounts;

// Export Plaid functions for API request
exports.createLinkToken = createLinkToken;
exports.exchangePublicToken = exchangePublicToken;

// Export the stripe functions
exports.createPaymentIntent = createPaymentIntent;

// Export the transaction ledger functions
exports.triggerImmediateTransfer = triggerImmediateTransfer;
exports.scheduleDailyTransfer = scheduleDailyTransfer;
