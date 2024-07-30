import React from 'react';
import PlaidLinkButton from '../Components/Plaid/PlaidLinkButton';


const Accounts = () => {
  return (
    <div className='account-container'>
      <h1 className="text-center">Accounts</h1>
      <div className='link container mt-96 mx-auto text-center'>
        <PlaidLinkButton />
      </div>
    </div>
  );
};

export default Accounts;