import React, { useEffect, useContext } from 'react';
import Dashboard from '../Dashboard/Dashboard.jsx'
import Landing from '../Landing/Landing.jsx'
import UserContext from '../Context/UserContext.jsx';
import { app } from '../Firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';

function App() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(UserContext);

  // Create instance of firebase auth
  const auth = getAuth(app);

  useEffect(() => {
    // Async function checks for elapsed time and logs user
    // out after 1 hour
    const checkLoginSession = async () => {
      // Check if user is already logged in and session is valid
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (loginTimestamp) {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - parseInt(loginTimestamp, 10);
        const elapsedHours = elapsed / (1000 * 60 * 60);
        // User login timestamp valid for 1 hour
        if (elapsedHours < 1) {
          // Session is still valid
          setIsLoggedIn(true);
        } else {
          // Session has expired, log out the user
          // Sign out with firebase auth
          await signOut(auth);
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('loginTimestamp');
        }
      }
    };

    checkLoginSession();
  }, [auth, setIsLoggedIn, setUser]);

  return (
    <>
      {isLoggedIn ? <Dashboard /> : <Landing />}
    </>
  );
}

export default App;
