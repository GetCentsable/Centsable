import React, { useContext, useEffect, useState } from 'react';
import TransactionContext from '../../Context/TransactionsContext';

const DetailTable = ({ selectedDate }) => {
  const { transactions } = useContext(TransactionContext);
  const [ converted_date, setConvertedDate ] = useState(selectedDate);

  // Extract transactions for the selected date
  const flattenedTransactions = [];
  transactions.forEach(transactionDateObj => {
    const dateKey = Object.keys(transactionDateObj)[0];
    if (dateKey === selectedDate) {
      const transactionsForDate = transactionDateObj[dateKey];
      // console.log(transactionsForDate);
      // console.log('Date key is', dateKey);

      const transactions = Object.values(transactionsForDate);
      // console.log(transactions);

      transactions.forEach((transaction) => {
        const amount = parseFloat(transaction.amount).toFixed(2);
        const round_up = parseFloat(transaction.round_up).toFixed(2);
        
        const new_transaction = {
          amount,
          round_up,
          merchant_name: transaction.merchant_name,
          logo_url: transaction.logo_url
        }
        flattenedTransactions.push(new_transaction);
      });
    }
  });

  // Format selected date
  useEffect(() => {
    const [year, month, day] = selectedDate.split('-');
    const convert_date = `${parseInt(month)}/${parseInt(day)}/${year}`;
    setConvertedDate(convert_date);
  }, [selectedDate])

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-bold mb-2 py-2 px-4 sticky top-0 bg-red-400 text-white">
        {converted_date}
      </h2>
      <div className="overflow-auto max-h-[calc(100vh-300px)] scrollbar-hide">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-2/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left py-2 px-4">Merchant</th>
              <th className="text-right py-2 px-4">Amount</th>
              <th className="text-right py-2 px-4">Round Up</th>
            </tr>
          </thead>
          <tbody>
            {flattenedTransactions?.map((transaction, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}>
                <td className="py-2 px-4 flex items-center">
                {transaction.logo_url ? (
                      <img
                        key={index}
                        src={transaction.logo_url}
                        alt={transaction.merchant_name}
                        className="w-8 my-2 h-8 lg:w-10 lg:h-10 rounded-lg mr-2"
                      />
                    ) : ( transaction.merchant_name === 'FUN' ? (
                        <div
                          key={index}
                          className="w-8 h-8 lg:w-10 my-2 mr-2 lg:h-10 lg:text-2xl font-medium rounded-lg bg-blue-500 text-white flex items-center justify-center"
                        >
                          FN
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="w-8 h-8 lg:w-10 lg:h-10 my-2 mr-2 lg:text-2xl rounded-lg font-medium flex items-center justify-center bg-green-400"
                        >
                          NL
                        </div>
                      )
                    )}
                  <span className="truncate">{transaction.merchant_name ? transaction.merchant_name : 'Unown Merchant'}</span>
                </td>
                <td className="text-right py-6 px-4 text-red-500 truncate">${transaction.amount}</td>
                <td className="text-right py-6 px-4 text-green-500 truncate">${transaction.round_up}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default DetailTable;