import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App'
import './index.css'
// Plaid provider context for global plaid variables
import { PlaidProvider } from "./Context/PlaidContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PlaidProvider>
      <App />
    </PlaidProvider>
  </React.StrictMode>,
)
