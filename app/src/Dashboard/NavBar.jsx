import React, { useState } from 'react';
import Button from '../Components/General/Button';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* NavBar */}
      <div 
        id="drawer-navigation" 
        className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-[80%]'
        } bg-white dark:bg-slate-700`} 
        tabIndex="-1" 
        aria-labelledby="drawer-navigation-label"
      >
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Button 
                title="Home"
              />
            </li>
            <li>
              <Button
                title="Contributions"
              />
            </li>
            <li>
              <Button 
                title="All Accounts"
              />
            </li>
            <li>
              <Button 
                title="Add Account"
              />
            </li>
            <li>
              <Button 
                title="Close NavBar"
                onClick={toggleNavBar}
              />
            </li>
          </ul>
        </div>
      </div>
      {/* Button to toggle NavBar */}
      <button
        onClick={toggleNavBar}
        className="text-gray-500 rounded-lg bg-neutral-100 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-slate-700 dark:hover:bg-red-400 dark:focus:ring-gray-600"
      >
      </button>
    </>
  );
};

export default NavBar;