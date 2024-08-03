const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const STRIPE_SECRET_KEY = functions.config().stripe.secret_key;

// REMOVE SECRET KEY FROM PUBLIC VIEW
const stripe = require("stripe")(STRIPE_SECRET_KEY);



const calculateOrderAmount = (items) => {
  return 2139; // Fixed amount for this example
};

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { items } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
      });
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});
