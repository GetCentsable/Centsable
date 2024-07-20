import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App.jsx';
// import Amplify from 'aws-amplify'
// import awsconfig from './aws-exports.js';
// import StripeProvider from './Components/Stripe/StripeProvider.jsx';
import './index.css';

// Configure amplify for React App
// Amplify.congfigure(awsconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <StripeProvider> */}
      <App />
    {/* </StripeProvider> */}
  </React.StrictMode>,
)
