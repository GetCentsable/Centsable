import React, { useState, useEffect } from 'react';
import AdminButton from '../Components/General/AdminButton';
import { getAuth } from 'firebase/auth';
import { app } from "../Firebase/firebase.js";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const AdminPage = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch users from Firestore on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [db]);

  // Fetch available dates based on selected user
  useEffect(() => {
    const fetchUserTransactionDates = async () => {
      if (!selectedUser || selectedUser === 'all') {
        setDates([]);
        return;
      }

      try {
        const transactionsCollection = collection(db, `users/${selectedUser.id}/transactions`);
        const transactionSnapshot = await getDocs(transactionsCollection);
        const transactionDates = transactionSnapshot.docs.map(doc => doc.id);
        setDates(['all', ...transactionDates]); // Include "All Dates" option
      } catch (error) {
        console.error('Error fetching transaction dates:', error);
        setDates([]);
      }
    };

    fetchUserTransactionDates();
  }, [db, selectedUser]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId === 'all' ? 'all' : users.find(user => user.id === userId));
    setSelectedDate(''); // Clear selected date when user changes
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const triggerFunction = async (functionName) => {
    if (!selectedUser && functionName === 'createPaymentIntent') {
      alert('Please select a user.');
      return;
    }
    if (!selectedDate && functionName === 'createPaymentIntent') {
      alert('Please select a date.');
      return;
    }
  
    const path = `https://us-central1-centsable-6f179.cloudfunctions.net/${functionName}`;
  
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
  
        // Format the request body according to the expected structure
        let requestBody;
        if (functionName === 'createPaymentIntent') {
          requestBody = {
            content: selectedDate === 'all' 
              ? dates.map(date => ({ date, user: selectedUser.id })) // Create an array with all dates if 'all' is selected
              : [{ date: selectedDate, user: selectedUser.id }]
          };
        } else {
          requestBody = {
            uid: selectedUser.id
          };
        }
  
        const response = await fetch(path, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          const data = await response.json();
          alert(`${functionName} triggered successfully for user ${selectedUser.username}!`);
        } else {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }
      } else {
        throw new Error('No current user found');
      }
    } catch (err) {
      console.error(`Error triggering ${functionName}:`, err);
      alert(`Failed to trigger ${functionName}: ${err.message}`);
    }
  };
  

  return (
    <div className="admin-page p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <select 
        value={selectedUser ? selectedUser.id : ''} 
        onChange={handleUserChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>Select a user</option>
        <option value="all">All Users</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.email}) - ID: {user.id}
          </option>
        ))}
      </select>

      <select 
        value={selectedDate} 
        onChange={handleDateChange}
        className="mb-4 p-2 border border-gray-300 rounded"
        disabled={!selectedUser || selectedUser === 'all'}
      >
        <option value="" disabled>Select a date</option>
        <option value="all">All Dates</option>
        {dates.filter(date => date !== 'all').map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      <div className="flex flex-col space-y-4">
        <AdminButton title="Generate Daily Logs" onClick={() => triggerFunction('triggerDailyLogs')} />
        <AdminButton title="Generate Monthly Logs" onClick={() => triggerFunction('triggerMonthlyLogs')} />
        <AdminButton title="Process Monthly Logs" onClick={() => triggerFunction('processMonthlyLog')} />
        <AdminButton title="Exchange Public Token" onClick={() => triggerFunction('exchangePublicToken')} />
        <AdminButton title="Create Link Token" onClick={() => triggerFunction('createLinkToken')} />
        <AdminButton title="Get User Transactions" onClick={() => triggerFunction('getUserTransactions')} />
        <AdminButton title="Trigger Immediate Transfer" onClick={() => triggerFunction('triggerImmediateTransfer')} />
        <AdminButton title="Load All User Transactions" onClick={() => triggerFunction('loadAllUserTransactions')} />
        <AdminButton title="Create Payment Intent" onClick={() => triggerFunction('createPaymentIntent')} />
        <AdminButton title="Get Linked Accounts" onClick={() => triggerFunction('getLinkedAccounts')} />
      </div>
    </div>
  );
};

export default AdminPage;
