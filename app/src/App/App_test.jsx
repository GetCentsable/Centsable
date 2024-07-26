import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { get } from 'aws-amplify/api';
// import { withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const [count, setCount] = useState(0);
  const [hello, setHello] = useState('');

  // Async function that test the lambda testFunction ()
  async function testLambda() {
    // Create a rest operation to an api endpoint
    try {
      const restOp = get({
        apiName: 'centsableApi',
        path: '/centsable'
      });

      // Wait for a response from the endpoint, check its status
      const response = await restOp.response;
      console.log('GET call succeeded: ', response.statusCode);

      if (response.statusCode !== 200)  {
        throw new Error(`HTTP request to /dev/centsable failed ${response.statusCode}`);
      }

      // Destructure the body for the 3 content types - str, blob, JSON
      const { body } = await restOp.response;
      const str = await body.text();
      console.log(str);

      setHello(str);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-blue-500 hover:text-lime-500">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button className='bg-red-500 hover:bg-lime-500 hover:cursor-pointer px-3 py-3' onClick={testLambda}>TEST LAMBDA</button>
        <p className='text-center font-bold size-30 text-3xl'>{hello}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
