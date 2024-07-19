import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// This sets up the stripe application with the stripe element for checkout,
// the key in loadStripe is public and not our secret key
const stripe = await loadStripe('pk_test_51PeJHuRqAKjBv5d0gX74sONv2jwoWMqXHhVqOui0atNT2IRVPcEKsOnVozppJ9NdruWAlndch5t47F6bTzWWFxY100WjFfBBPL');

const StripeProvider = ({ children }) => (
  <Elements stripe={stripe}>
    {children}
  </Elements>
);

export default StripeProvider;
