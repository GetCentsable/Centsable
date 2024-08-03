import React from 'react';

const CommunitiesList = ({ communities }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#66D7D1', '#F7FFF7', '#FFE66D'];

  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">Communities</h3>
      <ul>
        {communities.map((community, index) => (
          <li key={community.name} className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm">{community.name}</span>
            </div>
            <span className="text-sm font-semibold">{community.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunitiesList;