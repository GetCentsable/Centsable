import React, { useState } from 'react';
import NavBar from '../Navigation/NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Discover from './Discover';
import Donations from './Donations';
import Accounts from './Accounts';
import UserDrawer from '../Components/General/UserDrawer';

const Dashboard = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(true);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);

  const toggleNavBar = () => {
    setIsNavBarOpen(!isNavBarOpen);
  };

  const toggleUserDrawer = () => {
    setIsUserDrawerOpen(!isUserDrawerOpen);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <NavBar
          isOpen={isNavBarOpen}
          toggleNavBar={toggleNavBar}
          isUserDrawerOpen={isUserDrawerOpen}
          toggleUserDrawer={toggleUserDrawer}
        />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ${isNavBarOpen ? 'ml-64' : 'ml-20'}`}>
          <Routes>
            <Route path="/" element={<Home isUserDrawerOpen={isUserDrawerOpen} />} />
            <Route path="/home" element={<Home isUserDrawerOpen={isUserDrawerOpen} />} />
            <Route path="/discover" element={<Discover isUserDrawerOpen={isUserDrawerOpen} />} />
            <Route path="/donations" element={<Donations isUserDrawerOpen={isUserDrawerOpen} />} />
            <Route path="/accounts" element={<Accounts isUserDrawerOpen={isUserDrawerOpen} />} />
          </Routes>
        </main>
        <UserDrawer
          isOpen={isUserDrawerOpen}
          onClose={toggleUserDrawer}
        />
      </div>
    </Router>
  );
};

export default Dashboard;