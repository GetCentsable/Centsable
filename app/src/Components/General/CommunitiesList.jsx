import React, { useContext } from 'react';
import UserContext from '../../Context/UserContext';

const CommunitiesList = () => {
  const { recipientPreference } = useContext(UserContext);
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#66D7D1', '#ACFFAC', '#FFE66D'];

  return (
    <ul className="space-y-1">
      {recipientPreference.map((recipient, index) => (
        <li key={index}>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm">{recipient.recipient_name}</span>
            </div>
            <span className="text-sm font-semibold">{recipient.percentage}%</span>
          </div>
          {index < recipientPreference.length - 1 && (
            <div className="border-b border-gray-200"></div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommunitiesList;