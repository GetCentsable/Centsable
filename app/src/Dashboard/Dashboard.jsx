import React, { useState, useEffect } from 'react';
import NavBar from '../Navigation/NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Search from './Search';
import Donations from './Donations';
import Accounts from './Accounts';
import UserDrawer from '../Components/General/UserDrawer';

const Dashboard = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(true);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState('Home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          selectedItem={selectedNavItem}
          setSelectedItem={setSelectedNavItem}
        />
        <main className={`
          flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 min-h-screen
          ${isMobile ? 'mt-16' : (isNavBarOpen ? 'md:ml-64' : 'md:ml-20')}
          ${isMobile && isNavBarOpen ? 'pt-16' : ''}
        `}>
          <Routes>
            <Route path="/" element={<Home isUserDrawerOpen={isUserDrawerOpen} setSelectedNavItem={setSelectedNavItem} />} />
            <Route path="/home" element={<Home isUserDrawerOpen={isUserDrawerOpen} setSelectedNavItem={setSelectedNavItem} />} />
            <Route path="/search" element={<Search isUserDrawerOpen={isUserDrawerOpen} />} />
            <Route path="/donations" element={<Donations isUserDrawerOpen={isUserDrawerOpen} />} />
            <Route path="/accounts" element={<Accounts isUserDrawerOpen={isUserDrawerOpen} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default Dashboard;