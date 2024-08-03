import React, { useEffect, useContext } from 'react';
import Dashboard from '../Dashboard/Dashboard.jsx'
import Landing from '../Landing/Landing.jsx'
import UserContext from '../Context/UserContext.jsx';
import { app } from '../Firebase/firebase';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function App() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(UserContext);

  // Create instance of firebase auth
  const auth = getAuth(app);

  // Instantiate the db with Firestore
  const db = getFirestore(app);

  useEffect(() => {
    // Async function checks for elapsed time and logs user out after 1 hour
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
          // Retrieve the authenticated user
          onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
              const uid = currentUser.uid;
              const userDocRef = doc(db, 'users', uid);
              const userDocSnap = await getDoc(userDocRef);

              // Check if document exists
              if (userDocSnap.exists()) {
                // Extract the user data from the document snapshot
                const userData = userDocSnap.data();
                // Merge the user data from snapshot with user object
                const userWithDocData = { ...currentUser, ...userData };
                // Add the user object with additional data to the userContext
                setUser(userWithDocData);
              } else {
                console.error('User document does not exist');
              }
              setIsLoggedIn(true);
            } else {
              setIsLoggedIn(false);
              setUser(null);
              localStorage.removeItem('loginTimestamp');
            }
          });
        } else {
          // Session has expired, log out the user
          await signOut(auth);
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('loginTimestamp');
        }
      }
    };

    checkLoginSession();
  }, [auth, db, setIsLoggedIn, setUser]);

  return (
    <>
      {isLoggedIn ? <Dashboard /> : <Landing />}
    </>
  );
}

export default App;
