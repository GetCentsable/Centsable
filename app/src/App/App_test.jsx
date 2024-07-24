import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { API, Auth } from 'aws-amplify';

function App() {
  const [count, setCount] = useState(0);
  const [hello, setHello] = useState('');

  // Async function that test the lambda testFunction ()
  async function testLambda() {
    const url = 'https://fn3peb3590.execute-api.us-east-2.amazonaws.com/dev/centsable';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status !== 200)  {
        throw new Error(`HTTP request to /dev/centsable failed ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setHello(data);
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
