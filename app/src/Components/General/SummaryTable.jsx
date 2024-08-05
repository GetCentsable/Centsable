import React from 'react';

const SummaryTable = ({ data, onRowClick, selectedDate }) => (
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
            <th className="text-left py-2 px-4">Top Transactions</th>
            <th className="text-right py-2 px-4">Amount</th>
            <th className="text-right py-2 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day, index) => (
            <tr
              key={day.date}
              onClick={() => onRowClick(day.date)}
              className={`cursor-pointer ${
                selectedDate === day.date
                  ? 'bg-red-400 text-white'
                  : index % 2 === 0
                  ? 'bg-red-100'
                  : 'bg-white'
              }`}
            >
              <td className="py-2 px-4 truncate">
                {day.transactions.slice(0, 3).map((t, i) => (
                  <img key={i} src={t.photo} alt={t.organization} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full inline-block mr-2" />
                ))}
              </td>
              <td className={`text-right py-6 px-4 truncate ${selectedDate === day.date ? 'text-white' : 'text-green-500'}`}>
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

export default SummaryTable;