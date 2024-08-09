import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import Login from './Login';
import Register from './Register';
import ImpactCards from '../Components/General/ImpactCards';
import logo from '../assets/logo.png';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Dummy Data Images
import coinsGrowth from '../assets/coinsGrowth.png'
import disasterRelief from '../assets/disasterRelief.png'
import studentLife from '../assets/studentLife.png'
import dereksOrphanage from '../assets/dereksOrphanage.png'
import coachClint from '../assets/coachClint.png'
import chefPodcast from '../assets/chefPodcast.png'
import libbyForPrez from '../assets/libbyForPrez2.png'
import maxSka from '../assets/maxSka.png'
import meganBabysitting from '../assets/meganBabysitting.png'
import taylorSwiftCake from '../assets/taylorSwiftCake.png'
import danielsLaboratory from '../assets/danielsLaboratory.png'
import anthonysAwesomePhotos from '../assets/anthonysAwesomePhotos.png'

const Auth = ({ signUp, setSignUp, login, setLogin, onBackToLanding }) => {
  const handleToggle = (e) => {
    e.preventDefault();
    setSignUp(!signUp);
    setLogin(!login);
  }

  const impactCards = [
    { image: coinsGrowth, head: 'Centsable Milestone', categories: ['Personal', 'Tulsa'], text: 'We hit our first 10,000 users!' },
    { image: disasterRelief, head: 'Disaster Relief Feeds Thousands', categories: ['Tulsa'], text: 'We were able to provide hot meals and water to the people of Delta City' },
    { image: libbyForPrez, head: 'Libby for Prez - Reached 5000 Campaign Donors', categories: ['Tulsa', 'Personal'], text: 'We reached 5,000 donors and are ready to take on the universe!' },
    { image: dereksOrphanage, head: 'Derek\'s Orphanage Robo Family', categories: ['Personal'], text: 'Providing a loving home to 50 robot children!' },
    { image: chefPodcast, head: 'Chef Silas - Started A New Fund', categories: ['Oklahoma City', 'Personal'], text: 'Starting a fund for our very first recipe book! Let\'s get cooking!' },
    { image: maxSka, head: 'EPic Skaaa!', categories: ['Oklahoma City'], text: 'Reached our goal to record a new EP! Skaaa-tastic tunes coming your way!' },
    { image: danielsLaboratory, head: 'Daniel\'s Laboratory - Clone Conquest', categories: ['Personal', 'Tulsa'], text: 'Cloned our first intern. Twice the coffee runs, twice the fun!' },
    { image: studentLife, head: 'Atlas Student Life Commitee - Reached 200 Donors', categories: ['Tulsa'], text: 'We are not a cult' },
    { image: meganBabysitting, head: 'Megan\'s babysitting - World Record Achieved', categories: ['Oklahoma City', 'Personal'], text: 'Recognized by the Guiness World Records for juggling 10 kids at once without dropping a single one!' },
    { image: coachClint, head: 'Coach Clint - One Hundred Club', categories: ['Personal'], text: 'Celebrating 100 episodes with Tom Brady on \'Winning at Life: Strategies for Success!\'' },
    { image: taylorSwiftCake, head: 'Lydia\'s Taylor Swift Bakery - Bake It Off', categories: ['Tulsa', 'Personal'], text: 'Creating a life-size cake of Taylor Swift! Edible superstar incoming!' },
    { image: anthonysAwesomePhotos, head: 'Anthony\'s Photography - Goal Funded', categories: ['Oklahoma City'], text: 'Raised enough to rent gallery space' },
  ];

  const middleIndex = Math.floor(impactCards.length / 2);

  return (
    <div className="min-h-screen flex lg:flex-row">
      {/* Left side - Auth form */}
      <div className="w-full lg:w-1/2 bg-neutral-100 flex flex-col justify-center px-8 lg:px-16 relative">
        {/* Back button */}
        <button 
          onClick={onBackToLanding}
          className="absolute top-4 left-4 text-red-400 hover:text-red-500 flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="size-9"/>
          <span className="ml-2">Back</span>
        </button>

        <div className="max-w-md w-full mx-auto">
          <img src={logo} alt="Centsable logo" className="w-96" />
          {login ? <Login /> : <Register setLogin={setLogin} setSignUp={setSignUp} />}
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

      {/* Right side - Impact Sliders & Change Counter */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-red-400 p-8">
        <h2 className="text-4xl font-bold text-neutral-100 text-center mb-4">Change made this week</h2>
        <h3 className="text-2xl font-bold text-neutral-100 text-center mb-8">$1,234.56</h3>
        
        <div className="flex-grow flex flex-col justify-end space-y-4 mb-20 overflow-hidden">
          <div className="slider-container">
            <div className="slider">
              {[...impactCards, ...impactCards, ...impactCards].map((card, index) => (
                <div key={index} className="slide w-64 h-48 mx-2">
                  <img 
                    src={card.image} 
                    alt="Impact Card" 
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="slider-container">
            <div className="slider reverse">
              {[...impactCards.slice(middleIndex), ...impactCards, ...impactCards, ...impactCards.slice(0, middleIndex)].map((card, index) => (
                <div key={index} className="slide w-64 h-48 mx-2">
                  <img 
                    src={card.image} 
                    alt="Impact Card" 
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .slider-container {
          width: 100%;
          overflow: hidden;
        }

        .slider {
          display: flex;
          width: 300%;
          animation: slide 30s linear infinite;
        }

        .slider.reverse {
          animation-direction: reverse;
        }

        .slide {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default Auth;