import React, { useEffect, useState } from 'react';
import Auth from '../Auth/Auth.jsx';
import Button from '../Components/General/SimpleButton.jsx';
import logo from '../assets/logo.png';

function Landing() {
  const [signUp, setSignUp] = useState(false);
  const [login, setLogin] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLogin(true);
    setSignUp(false);
  }

  const handleSignUp = (e) => {
    e.preventDefault();
    setLogin(false);
    setSignUp(true);
  }

  return (
    <>
      {(signUp || login) ?
          <Auth
          signUp={signUp}
          setSignUp={setSignUp}
          login={login}
          setLogin={setLogin}
        ></Auth> :
        <div className='landing-container bg-neutral-100 w-full h-screen'>
          <div className='landing-header bg-slate-700'>
            <div className='button-container flex justify-end px-6'>
              <Button title='Login' onClick={handleLogin} className='w-auto my-3 mx-3 px-9 bg-neutral-100 text-black text-lg py-1'></Button>
              <Button title='Sign Up' onClick={handleSignUp} className='w-auto my-3 mx-3 px-9 text-lg py-1'></Button>
            </div>
          </div>
          <div className='body-container mx-auto flex flex-col mt-24 w-2/3'>
            <img src={logo} alt='centsable-logo' className='mx-auto'></img>
            <Button title='Sign Up' onClick={handleSignUp} className='w-auto self-center mt-12 text-5xl py-4 px-28'></Button>
            <p className='text-black mt-20 text-4xl font-bold'>Use Centsable to...</p>
          </div>
        </div>
      }
    </>
  )
}

export default Landing;