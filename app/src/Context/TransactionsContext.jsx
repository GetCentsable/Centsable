// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // Global states
  const [transactions, setTransactions] = useState({});
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);

  // Transaction Provider passes user states to all children
  return (
    <TransactionContext.Provider value={{ 
      transactions,
      transactionsLoaded,
      setTransactions,
      setTransactionsLoaded,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;
