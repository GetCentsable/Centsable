import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App_test.jsx'
import './index.css'

// Amazon Amplify configuration integration
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports.js';
Amplify.configure(awsconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
