import React, { useEffect, useContext } from 'react';
import Dashboard from '../Dashboard/Dashboard.jsx'
import Landing from '../Landing/Landing.jsx'
import UserContext from '../Context/UserContext.jsx';

function App() {
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    // Check if user is already logged in and session is valid
    const loggedIn = localStorage.getItem('isLoggedIn');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loggedIn && loginTimestamp) {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - parseInt(loginTimestamp, 10);
        const elapsedHours = elapsed / (1000 * 60 * 60);
        // User login in timestamp valid for 10 minutes
        if (elapsedHours < 0.000000001) {
            // Session is still valid
            setIsLoggedIn(true);
        } else {
            // Session has expired, log out the user
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTimestamp');
        }
    }
  }, []);

  return (
    <>
      {isLoggedIn ? <Dashboard /> : <Landing />}
    </>
  );
}

export default App;
