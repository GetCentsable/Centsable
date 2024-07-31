import React, { useContext, useState } from 'react';
import Button from '../Components/General/SimpleButton.jsx';
import Input from '../Components/General/Input';
import { app } from '../Firebase/firebase.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import UserContext from '../Context/UserContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState(false);
  const { setUser, setIsLoggedIn } = useContext(UserContext);

  // Instantiate the auth service SDK
  const auth = getAuth(app);

  // Instantiate the db with Firestore
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Login attempt with:', email, password);
    try {
      // Sign in with email and password in firebase auth service
      console.log('Sending auth login request');
      const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
      );
      console.log('Auth login request complete');

      // The signed-in user object returned by firebase auth
      const user = userCredential.user;
      // console.log(user);

      // Retrieve additional user info from Firestore
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      // Check if document exist
      if (userDocSnap.exists()) {
        // Extract the user data from the document snapshot
        const userData = userDocSnap.data();
        // Merge the user data from snapshot with user object
        // that is returned by firebase/auth
        const userWithDocData = { ...user, ...userData };
        console.log(userWithDocData);
        // Add the user object with additional data to the userContext
        // for global access
        setUser(userWithDocData);
      } else {
        console.error('User document does not exist');
      }

      // Store login timestamp in local storage
      localStorage.setItem('loginTimestamp', new Date().getTime());

      setIsLoggedIn(true);
    } catch (err) {
        // Handle Errors here
        const errorMessage = err.message;
        setError(errorMessage);
        setFailed(true);
        setTimeout(() => {
            setFailed(false);
        }, 2600)
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-left">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <Input
            type="email"
            value={email}
            onChange={setEmail}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <Button
          type="submit"
          title="Login"
          onClick={() => {}}
        />
      </form>
    </div>
  );
};

export default Login;