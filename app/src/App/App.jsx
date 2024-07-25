// import { useEffect, useState } from 'react'
import Dashboard from '../Dashboard/Dashboard'
import { Authenticator } from '@aws-amplify/ui-react';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [userUsername, setUserUsername] = useState('');

  return (
    <>
      <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header className="App-header">
            <Dashboard userUsername={user.username} />
            <button onClick={signOut}>Sign Out</button>
          </header>
        </div>
      )}
        {/* <div>
          {isLoggedIn ? (
            <Dashboard userUsername={userUsername} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <Auth setUserUsername={setUserUsername} setIsLoggedIn={setIsLoggedIn} />
          )}
        </div> */}
      </Authenticator>
    </>
  )
}

export default App
