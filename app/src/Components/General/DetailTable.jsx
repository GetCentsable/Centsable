import React from 'react';

const DetailTable = ({ data, selectedDate }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="font-bold mb-2 py-2 px-4 sticky top-0 bg-red-400 text-white">
      {selectedDate}
    </h2>
    <div className="overflow-auto max-h-[calc(100vh-300px)] scrollbar-hide">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-3/4" />
          <col className="w-1/4" />
        </colgroup>
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="text-left py-2 px-4">Organization</th>
            <th className="text-right py-2 px-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((transaction, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-red-100' : 'bg-white'}>
              <td className="py-2 px-4 flex items-center">
                <img src={transaction.photo} alt={transaction.organization} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full mr-2 flex-shrink-0" />
                <span className="truncate">{transaction.organization}</span>
              </td>
              <td className="text-right py-6 px-4 text-green-500 truncate">${transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DetailTable;