import React, { useState, useEffect } from 'react';
import './App.css';
import Button from '../Components/General/Button';
// import CheckoutForm from '../Components/Stripe/CheckoutForm';
// import PlaidLinkComponent from '../Components/Plaid/PlaidLinkComponent';

const App = () => {

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-500 text-center">Merge Test</h1>
      <Button className={'py-1 bg-black text-lime-400 rounded-3xl'}>BUTTON</Button>
      {/* <CheckoutForm /> */}
    </div>
  );
};

export default App;
