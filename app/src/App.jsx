import './App.css';
import Amplify from 'aws-amplify';
import { get } from 'aws-amplify/api';
import React, { useEffect, useState } from 'react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const myAPI = "censtableApiGateway";
const path = '/users'; 

const App = () => {
  const [hello, setHello] = useState('');

  // Function to fetch from our backend and update customers array
  async function getCustomer() {
    try {
      const restOp = get({
        apiName: myAPI,
        path: path,
      });
      const response = await restOp.response;
      console.log('GET CALL WORKED:', response);
      setHello(response.body);
    } catch (e) {
      console.log('ERROR:', e);
    }
  }

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div className="App">
      <h1>Super Simple React App</h1>
      <br/>
      <p>{hello}</p>
    </div>
  );
}

export default App;
