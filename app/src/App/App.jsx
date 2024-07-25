import { useEffect, useState } from 'react'
import Auth from '../Auth/Auth'
import Dashboard from '../Dashboard/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userUsername, setUserUsername] = useState('');

  return (
    <>
      <div>
        {isLoggedIn ? (
          <Dashboard userUsername={userUsername} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Auth setUserUsername={setUserUsername} setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </>
  )
}

export default App
