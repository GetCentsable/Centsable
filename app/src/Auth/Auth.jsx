import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import logo from '../assets/logo.png';

const Auth = ({ setIsLoggedIn, signUp, setSignUp, login, setLogin }) => {

  const handleToggle = (e) => {
    e.preventDefault;
    setSignUp(!signUp);
    setLogin(!login);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="w-full xl:w-1/2 bg-neutral-100 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <img src={logo} alt="Centsable logo" className="w-96" />
          {login ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Register setLogin={setLogin} setSignUp={setSignUp} />}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {login ? "New to Centsable? " : "Have an account? "}
              <button 
                onClick={handleToggle}
                className="font-medium text-red-400 hover:text-red-500"
              >
                {login ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Trending & Change Counter */}
      <div className="hidden xl:flex flex-col text-center w-1/2 bg-red-400 pt-36">
        <h2 className="text-4xl font-bold text-neutral-100">Change made this week</h2>
        <h3 className="text-2xl font-bold text-neutral-100">$1,234.56</h3>
      </div>
    </div>
  );
};

export default Auth;