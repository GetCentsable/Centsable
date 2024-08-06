import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../Navigation/NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { app } from "../Firebase/firebase.js";
import { getAuth } from 'firebase/auth';
import Home from './Home';
import Search from './Search';
import Donations from './Donations';
import Accounts from './Accounts';
import UserDrawer from '../Components/General/UserDrawer';
import TransactionContext from '../Context/TransactionsContext';

const Dashboard = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(true);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState('Home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {
    transactions,
    setTransactions,
    setTransactionsLoaded,
  } = useContext(TransactionContext);

  // Insantiate firebase auth
  const auth = getAuth(app);

  // Runs once on user log in to retrieve recent
  // transactions from plaid api
  useEffect(() => {
    // Async function sends req to firebase function
    const getUserTransactions = async () => {
      // Path to the firebase function
      const path = 'https://us-central1-centsable-6f179.cloudfunctions.net/getUserTransactions';

      try {
        // Get current user object from firebase auth
        const currentUser = auth.currentUser;

        if(currentUser) {
          // Generate firebase user id token from current user
          const idToken = await currentUser.getIdToken();

          // Fetch call to getUserTransactions to get non
          // sensitive transaction data
          const response = await fetch(path, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              uid: currentUser.uid,
            }),
          });

          // If request failed, reset transactions state to empty array,
          // tranactionsLoaded state to false, and return
          if (!response.ok) {
            setTransactions({})
            setTransactionsLoaded(false);
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
          }

          // Check the data for errors
          const data = await response.json();
          if (!data) {
            setTransactions({})
            setTransactionsLoaded(false);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // If there are no errors, add the transactions array
          // to the context transactions, and toggle transactionsLoaded
          setTransactions(data);
          setTransactionsLoaded(true);
          // console.log('User transactions retrieved:', data);
        } else {
          throw new Error('No current user found');
        }
      } catch (err) {
        console.log('There was an error fetching user transaction history:', err);
      }
    }

    // Invoke function
    getUserTransactions();
  }, []);

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