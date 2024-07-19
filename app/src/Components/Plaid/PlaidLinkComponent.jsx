import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLinkComponent = ({ token, onSuccess }) => {
  const { open, ready, error } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default PlaidLinkComponent;
