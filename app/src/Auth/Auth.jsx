import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {


  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="w-full xl:w-1/2 bg-neutral-100 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <img src="/logo.svg" alt="Centsable logo" className="w-24 mx-auto" />
          {isLogin ? <Login /> : <Register />}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "New to Centsable? " : "Have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-red-400 hover:text-red-500"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Trending & Change Counter */}
      <div className="hidden xl:flex w-1/2 bg-red-400 justify-center">
        <h2 className="text-4xl font-bold text-neutral-100">Change made this week</h2>
        <h3 className="text-2xl font-bold text-neutral-100">$1,234.56</h3>
      </div>
    </div>
  );
};

export default Auth;