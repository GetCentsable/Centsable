import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App'
import './index.css'
// Plaid provider context for global plaid variables
import { PlaidProvider } from "./Context/PlaidContext.jsx";
import { UserProvider } from './Context/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <PlaidProvider>
        <App />
      </PlaidProvider>
    </UserProvider>
  </React.StrictMode>,
)
