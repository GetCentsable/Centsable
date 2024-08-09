import React, { useState, useEffect } from 'react';
import AdminButton from '../Components/General/AdminButton';
import { getAuth } from 'firebase/auth';
import { app } from "../Firebase/firebase.js";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import PieChart from '../Components/General/PieChart';

const AdminPage = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [totalRoundup, setTotalRoundup] = useState(0);
  const [recipientData, setRecipientData] = useState([]);
  const [monthlyLogData, setMonthlyLogData] = useState({});
  const [allUserData, setAllUserData] = useState({});

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

  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const holdingAccountRef = collection(db, 'bank_accounts/TEBGHPGaGH8imJTyeasV/monthly_logs');
        const monthsSnapshot = await getDocs(holdingAccountRef);
        const availableMonths = monthsSnapshot.docs.map(doc => doc.id);
        setMonths(['all', ...availableMonths]); 
      } catch (error) {
        console.error('Error fetching available months:', error);
        setMonths([]);
      }
    };
    fetchAvailableMonths();
  }, [db]);

  useEffect(() => {
    const fetchUserTransactionDates = async () => {
      if (!selectedUser || selectedUser === 'all') {
        setDates(['all']);
        return;
      }
      try {
        const transactionsCollection = collection(db, `users/${selectedUser.id}/transactions`);
        const transactionSnapshot = await getDocs(transactionsCollection);
        const transactionDates = transactionSnapshot.docs.map(doc => doc.id);
        setDates(['all', ...transactionDates]); 
      } catch (error) {
        console.error('Error fetching transaction dates:', error);
        setDates([]);
      }
    };
    fetchUserTransactionDates();
  }, [db, selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchTransactionData = async () => {
        setTransactionsLoaded(false);
        setTotalRoundup(0);
        setRecipientData([]);

        try {
            let transactions = [];
            if (selectedUser === 'all') {
                // Fetch transactions for all users
                const usersSnapshot = await getDocs(collection(db, 'users'));
                for (const userDoc of usersSnapshot.docs) {
                    const transactionsSnapshot = await getDocs(collection(db, `users/${userDoc.id}/transactions`));
                    transactions.push(...transactionsSnapshot.docs.map(doc => doc.data()));
                }
            } else {
                // Fetch transactions for the selected user
                const transactionsSnapshot = await getDocs(collection(db, `users/${selectedUser.id}/transactions`));
                transactions = transactionsSnapshot.docs.map(doc => doc.data());
            }

            console.log('Fetched Transactions:', transactions);

            let totalRoundupAmount = 0;
            let communityData = {};

            transactions.forEach((transaction) => {
                // Iterate through the keys in each transaction object
                Object.values(transaction).forEach((transactionData) => {
                    console.log('Processing Transaction:', transactionData);

                    // Check if the transactionData has round_up and distributions
                    if (transactionData && transactionData.round_up) {
                        totalRoundupAmount += transactionData.round_up || 0;

                        if (Array.isArray(transactionData.distributions)) {
                            transactionData.distributions.forEach((distribution) => {
                                const { recipient_name, transfer_amount } = distribution;
                                if (recipient_name && transfer_amount) {
                                    if (!communityData[recipient_name]) {
                                        communityData[recipient_name] = 0;
                                    }
                                    communityData[recipient_name] += transfer_amount;
                                }
                            });
                        }
                    }
                });
            });

            console.log('Total Roundup Amount:', totalRoundupAmount);
            console.log('Community Data:', communityData);

            setTotalRoundup(totalRoundupAmount);
            setRecipientData(Object.entries(communityData).map(([name, amount]) => ({
                name,
                percentage: (amount / totalRoundupAmount) * 100,
            })));
            setTransactionsLoaded(true);
        } catch (error) {
            console.error('Error fetching transaction data:', error);
            setTransactionsLoaded(false);
        }
    };

    fetchTransactionData();
}, [db, selectedUser, selectedDate]);



  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId === 'all' ? 'all' : users.find(user => user.id === userId));
    setSelectedDate('');
    setTransactionsLoaded(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const triggerFunction = async (functionName) => {
    if ((functionName === 'processMonthlyLog' || functionName === 'triggerMonthlyLogs') && !selectedMonth) {
      alert('Please select a month.');
      return;
    }

    const path = `https://us-central1-centsable-6f179.cloudfunctions.net/${functionName}`;
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        let requestBody;

        if (functionName === 'createPaymentIntent' || functionName === 'triggerDailyLogs') {
          if (selectedUser === 'all' && selectedDate === 'all') {
            const allUsersAndDates = await Promise.all(
              users.map(async (user) => {
                const transactionsCollection = collection(db, `users/${user.id}/transactions`);
                const transactionSnapshot = await getDocs(transactionsCollection);
                return transactionSnapshot.docs.map(doc => ({ date: doc.id, user: user.id }));
              })
            );
            requestBody = { content: allUsersAndDates.flat() };
          } else if (selectedUser === 'all') {
            const allUsersForDate = users.map(user => ({ date: selectedDate, user: user.id }));
            requestBody = { content: allUsersForDate };
          } else if (selectedDate === 'all') {
            requestBody = {
              content: dates.filter(date => date !== 'all').map(date => ({ date, user: selectedUser.id }))
            };
          } else {
            requestBody = {
              content: [{ date: selectedDate, user: selectedUser.id }]
            };
          }
        } else if (functionName === 'processMonthlyLog' || functionName === 'triggerMonthlyLogs') {
          if (selectedMonth === 'all') {
            requestBody = { months: months.filter(month => month !== 'all') };
          } else {
            requestBody = { months: [selectedMonth] };
          }
        } else {
          requestBody = { uid: selectedUser.id };
        }

        // Log the actual content of the requestBody
        console.log('Request body being sent:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(path, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          alert(`${functionName} triggered successfully!`);
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
      >
        <option value="" disabled>Select a date</option>
        <option value="all">All Dates</option>
        {dates.filter(date => date !== 'all').map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      <select 
        value={selectedMonth} 
        onChange={handleMonthChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>Select a month</option>
        <option value="all">All Months</option>
        {months.filter(month => month !== 'all').map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <div className="flex flex-col space-y-4">
        <AdminButton title="Generate Daily Logs" onClick={() => triggerFunction('triggerDailyLogs')} />
        <AdminButton title="Generate Monthly Logs" onClick={() => triggerFunction('triggerMonthlyLogs')} />
        <AdminButton title="Process Monthly Logs" onClick={() => triggerFunction('processMonthlyLog')} />
        <AdminButton title="Load All User Transactions" onClick={() => triggerFunction('loadAllUserTransactions')} />
        <AdminButton title="Create Payment Intent" onClick={() => triggerFunction('createPaymentIntent')} />
      </div>

      {/* Pie Chart Section */}
      {transactionsLoaded && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Recipient Breakdown</h2>
            <PieChart total={totalRoundup} communities={recipientData} />
          </div>
          {selectedUser === 'all' && (
            <>
              <div>
                <h2 className="text-lg font-bold mb-2">Monthly Log Totals</h2>
                <PieChart total={Object.values(monthlyLogData).reduce((a, b) => a + b, 0)} communities={Object.entries(monthlyLogData).map(([month, amount]) => ({ name: month, percentage: (amount / Object.values(monthlyLogData).reduce((a, b) => a + b, 0)) * 100 }))} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">Holding Account Overview</h2>
                <PieChart total={allUserData.balance} communities={[
                  { name: 'Balance', percentage: (allUserData.balance / (allUserData.balance + allUserData.paid + allUserData.received)) * 100 },
                  { name: 'Paid', percentage: (allUserData.paid / (allUserData.balance + allUserData.paid + allUserData.received)) * 100 },
                  { name: 'Received', percentage: (allUserData.received / (allUserData.balance + allUserData.paid + allUserData.received)) * 100 }
                ]} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
