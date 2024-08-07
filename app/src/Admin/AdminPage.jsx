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

  const triggerFunction = async (functionName) => {
    if (!selectedUser) {
      alert('Please select a user.');
      return;
    }

    const path = `https://us-central1-your-project-id.cloudfunctions.net/${functionName}`;
    
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        
        const response = await fetch(path, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            uid: selectedUser.id,  // Pass the selected user's ID to the function
          }),
        });
        
        if (response.ok) {
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
      <div className="flex flex-col space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))
        ) : (
          <p>Loading users...</p>
        )}
      </div>
      <select 
        value={selectedUser ? selectedUser.id : ''} 
        onChange={(e) => setSelectedUser(users.find(user => user.id === e.target.value))}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.email})
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
