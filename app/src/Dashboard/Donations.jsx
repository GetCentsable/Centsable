import { useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import PieChart from '../Components/General/PieChart';
import CommunitiesList from '../Components/General/CommunitiesList';
import Header from '../Components/General/Header';

const Donations = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Placeholder data - replace with data
  const weeklyTotal = 2.45;
  const communities = [
    { name: 'Animal Rescue Foundation', percentage: 30 },
    { name: 'Tolarian Community College', percentage: 20 },
    { name: 'Rings of Chaos', percentage: 20 },
    { name: 'Tulsa Makerspace', percentage: 15 },
    { name: 'Tulsa Spotlight Theatre', percentage: 10 },
    { name: 'Centsable', percentage: 5 },
  ];
  
  // Extended dummy data
  const summaryData = Array(20).fill().map((_, index) => ({
    date: `07/${23 - index}/24`,
    amount: (Math.random() * 5).toFixed(2),
    transactions: [
      { icon: '🍔', name: 'Burger King' },
      { icon: '🎵', name: 'Spotify' },
      { icon: '🛒', name: 'Walmart' }
    ]
  }));

  const detailedData = summaryData.reduce((acc, day) => {
    acc[day.date] = Array(5).fill().map(() => ({
      organization: ['Spotify', 'Burger King', 'Walmart', 'Amazon', 'Netflix'][Math.floor(Math.random() * 5)],
      amount: (Math.random() * 2).toFixed(2)
    }));
    return acc;
  }, {});

  return (
    <div className="p-6">
      <Header
        pageTopic="Contribution history"
        supportingText="Track your recent contributions"
        icon={faFilter}
        buttonText="Apply filter"
      />
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Report */}
        <div className="bg-white p-4 rounded-lg shadow">
          <PieChart total={weeklyTotal} communities={communities} />
          <CommunitiesList communities={communities} />
        </div>

        {/* Middle Column - Summary Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-4">Top Transactions</th>
                  <th className="text-right py-2 px-4">Amount</th>
                  <th className="text-right py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((day, index) => (
                  <tr
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`cursor-pointer ${
                      selectedDate === day.date
                        ? 'bg-red-400 text-white'
                        : index % 2 === 0
                        ? 'bg-red-100'
                        : 'bg-white'
                    }`}
                  >
                    <td className="py-2 px-4">
                      {day.transactions.slice(0, 3).map((t, i) => (
                        <span key={i} className="mr-2">{t.icon}</span>
                      ))}
                    </td>
                    <td className="text-right py-2 px-4">${day.amount}</td>
                    <td className="text-right py-2 px-4">{day.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Detailed Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className={`font-bold mb-2 py-2 px-4 sticky top-0 ${selectedDate ? 'bg-red-400 text-white' : ''}`}>
            {selectedDate || 'Select a date'}
          </h2>
          {selectedDate && (
            <div className="overflow-auto max-h-[calc(100vh-300px)]">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-4">Organization</th>
                    <th className="text-right py-2 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedData[selectedDate].map((transaction, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-red-100' : 'bg-white'}>
                      <td className="py-2 px-4">{transaction.organization}</td>
                      <td className="text-right py-2 px-4">${transaction.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;