import React, { useState } from 'react';
import NavBar from '../Navigation/NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Discover from './Discover';
import Donations from './Donations';
import Accounts from './Accounts';

const Dashboard = ({ userUsername, signOut, userEmail }) => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(true);

  const toggleNavBar = () => {
    setIsNavBarOpen(!isNavBarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <NavBar
          userUsername={userUsername}
          signOut={signOut}
          userEmail={userEmail}
          isOpen={isNavBarOpen}
          toggleNavBar={toggleNavBar}
        />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ${isNavBarOpen ? 'ml-64' : 'ml-20'}`}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/accounts" element={<Accounts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default Dashboard;