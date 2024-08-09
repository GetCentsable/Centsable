import { useState } from 'react';
import Auth from '../Auth/Auth.jsx';
import Button from '../Components/General/SimpleButton.jsx';
import logo from '../assets/logo.png';
import TypeWriter from '../Components/General/TypeWriter.jsx';

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

  const handleBackToLanding = () => {
    setSignUp(false);
    setLogin(false);
  }

  const typewriterPhrases = [
    "donate to charities",
    "aid disaster relief",
    "support an artist",
    "help animal shelters",
    "fund medical research",
    "support local events",
    "save for a vacation",
    "support a streamer",
    "fund community projects",
    "help small businesses"
  ];

  return (
    <>
      {(signUp || login) ?
          <Auth
          signUp={signUp}
          setSignUp={setSignUp}
          login={login}
          setLogin={setLogin}
          onBackToLanding={handleBackToLanding}
        ></Auth> :
        <div className='landing-container bg-neutral-100 w-full h-screen'>
          <div className='landing-header bg-slate-700'>
            <div className='button-container flex justify-evenly sm:justify-end px-6'>
              <Button title='Login' onClick={handleLogin} className='w-auto my-3 mx-3 px-6 sm:px-9 bg-neutral-100 text-black text-base sm:text-lg py-1'></Button>
              <Button title='Sign Up' onClick={handleSignUp} className='w-auto my-3 mx-3 px-6 sm:px-9 text-base sm:text-lg py-1'></Button>
            </div>
          </div>
          <div className='body-container mx-auto flex flex-col mt-24 w-2/3'>
            <img src={logo} alt='centsable-logo' className='mx-auto'></img>
            <Button title='Sign Up' onClick={handleSignUp} className='shadow-xl w-auto self-center mt-12 text-3xl sm:text-5xl py-4 px-16 sm:px-28'></Button>
            <p className='text-slate-700 mt-36 text-2xl sm:text-4xl font-bold mx-auto'>Use Centsable to</p>
            <p className='text-slate-700 mt-1 text-xl sm:text-3xl font-bold mx-auto'><TypeWriter phrases={typewriterPhrases} /></p>
          </div>
        </div>
      }
    </>
  )
}

export default Landing;