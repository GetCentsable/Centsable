import React, { useContext } from 'react';
import TransactionContext from '../../Context/TransactionsContext';

const SummaryTable = ({ onRowClick, selectedDate }) => {
  const { transactions } = useContext(TransactionContext);

  // Flatten the transactions object into an array of transactions with dates
  const flattenedTransactions = [];
  transactions.forEach((transactionDateObj) => {
    const dateKey = Object.keys(transactionDateObj)[0];
    const transactionsForDate = Object.values(transactionDateObj)[0];
    const firstTransaction = Object.values(transactionsForDate)[0];
    const formatted_date = firstTransaction.date;
  
    const amount = Object.values(transactionsForDate)
      .reduce((total, trans) => total + trans.round_up, 0)
      .toFixed(2);
  
    flattenedTransactions.push({
      dateKey,
      date: formatted_date,
      amount,
      transactions: Object.values(transactionsForDate)
    });
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="overflow-auto max-h-[calc(100vh-300px)] scrollbar-hide">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-1/2" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left py-2 px-4">Top Contributions</th>
              <th className="text-right py-2 px-4">Round Up Total</th>
              <th className="text-right py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {flattenedTransactions.reverse().map((day, index) => (
              <tr
                key={day.date}
                onClick={() => onRowClick(day.dateKey)}
                className={`cursor-pointer ${
                  selectedDate === day.date
                    ? 'bg-red-400 text-white'
                    : index % 2 === 0
                    ? 'bg-slate-200 hover:bg-red-200'
                    : 'bg-white hover:bg-red-200'
                }`}
              >
                <td className="py-4 px-4 truncate flex items-center ju">
                  {day.transactions.slice(0, 3).map((t, i) => (
                    t.logo_url ? (
                      <img
                        key={i}
                        src={t.logo_url}
                        alt={t.merchant_name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg mr-2"
                      />
                    ) : ( t.merchant_name === 'FUN' ? (
                        <div
                          key={i}
                          className="w-8 h-8 lg:w-10 lg:h-10 text-2xl font-medium rounded-lg bg-blue-500 text-white flex items-center justify-center"
                        >
                          FN
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="w-8 h-8 lg:w-10 lg:h-10 text-2xl rounded-lg font-medium mr-2 flex items-center justify-center bg-green-400"
                        >
                          NL
                        </div>
                      )
                    )
                  ))}
                </td>
                <td
                  className={`text-right py-6 px-4 truncate ${
                    selectedDate === day.date ? 'text-white' : 'text-green-500'
                  }`}
                >
                  ${day.amount}
                </td>
                <td className="text-right py-6 px-4 truncate">{day.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
