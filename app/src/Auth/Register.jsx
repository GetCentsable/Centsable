import React, { useEffect, useState, useContext } from 'react';
import Button from '../Components/General/SimpleButton.jsx';
import Input from '../Components/General/Input';
import { app } from '../Firebase/firebase.js';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import UserContext from '../Context/UserContext.jsx';
import loadingPig from '../assets/loading.gif';

const Register = ({ setLogin, setSignUp }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState(false);
  const { setUser, setIsLoggedIn } = useContext(UserContext);

  // Instantiate the auth service SDK
  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only execute if passwords match
    if(passwordMatch === true) {
      // console.log('Sign up attempt with:', email, password);
      // Toggle loading state for interactive loading
      setLoading(true);
      try {
        // Sign Up with email and password in firebase auth service
        console.log('Sending auth sign up request');
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log('Auth sign up request complete');

        // The signed-in user object returned by firebase auth
        const user = userCredential.user;
        // console.log(user);

        // Save additional user info in Auth
        await updateProfile(user, {
          displayName: username,
        });

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1600)
        setTimeout(() => {
            setSuccess(false);
            setLogin(false);
            setSignUp(false);

            // Store login timestamp in local storage
            localStorage.setItem('loginTimestamp', new Date().getTime());
            
            // Add the user object into the userContext for global access
            // and set log it to true to switch to dashboard
            setUser(user);
            setIsLoggedIn(true);
        }, 3000)
      } catch (error) {
        console.log('FAILED');
        console.log(error);
        setError(error.message);
        setTimeout(() => {
          setLoading(false);
        }, 1000)
        setFailed(true);
        setTimeout(() => {
            setFailed(false);
        }, 3000)
      }
    }
  };

  useEffect(() => {
    // Check if passwords match
    if(password === confirmPassword) {
      setPasswordMatch(true);
    } else {
      console.log('Passwords do not match!')
      setError('Passwords do not match');
      setPasswordMatch(false);
    }
  }, [confirmPassword])

  return (
    <>
      {loading && <img src={loadingPig} alt='loadingPigGif'></img>}
      {!loading && !success && !failed && 
        <div className="max-w-md mx-auto p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-left">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                type="text"
                value={username}
                onChange={setUsername}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={setEmail}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={setPassword}
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
            {!passwordMatch && <p className='text-red-600'>Passwords do not match</p>}
            <Button 
              title="Sign Up"
              onClick={() => {}}
            />
          </form>
        </div>
      }
      {success && !loading && 
        <div className="success">
          <h1 className="success-text">Thank you for joining {username}!</h1>
        </div>
      }
      {failed && !loading && 
        <div className="success">
          <h1 className="success-text">{error}</h1>
        </div>
      }
    </>
  );
};

export default Register;