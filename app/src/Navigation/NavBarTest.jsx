import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHistory, faWallet, faPlus, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const NavBar = ({ signOut, userUsername, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  const NavButton = ({ icon, title }) => (
    <button className="w-full flex items-center space-x-3 text-slate-200 hover:bg-slate-600 p-2 rounded">
      <FontAwesomeIcon icon={icon} />
      <span>{title}</span>
    </button>
  );

  return (
    <>
      <div 
        id="drawer-navigation" 
        className={`fixed top-0 left-0 w-64 h-screen p-4 overflow-y-auto transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-slate-700 flex flex-col`} 
        tabIndex="-1" 
        aria-labelledby="drawer-navigation-label"
      >
        <div className="flex-grow">
          <img src="/logo.svg" alt="Centsable logo" className="w-24 mx-auto mb-6" />
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-slate-600 text-slate-200 pl-10 pr-4 py-2 rounded"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>

          <nav className="space-y-2">
            <NavButton icon={faHome} title="Home" />
            <NavButton icon={faHistory} title="Recent Contributions" />
            <NavButton icon={faWallet} title="All Accounts" />
            <NavButton icon={faPlus} title="Add Account" />
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-600">
          <div className="flex items-center mb-4">
            <img src="/path-to-user-avatar.jpg" alt="User avatar" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <p className="text-slate-200 font-semibold">{userUsername}</p>
              <p className="text-slate-400 text-sm">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="w-full flex items-center space-x-3 text-slate-200 hover:bg-slate-600 p-2 rounded"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <button
        onClick={toggleNavBar}
        className="fixed top-4 left-4 text-slate-200 bg-slate-700 p-2 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>
    </>
  );
};

export default NavBar;