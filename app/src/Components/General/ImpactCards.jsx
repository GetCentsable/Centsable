import React from 'react';

const ImpactCard = ({ image, head, text }) => {
  return (
    <div className="impact-card bg-gray-100 p-2 rounded-lg">
      <div className="h-60 mb-2 overflow-hidden">
        <img 
          src={image} 
          alt={head} 
          className="w-full h-full object-cover object-center rounded"
        />
      </div>
      <h3 className="text-left font-semibold">{head}</h3>
      <p className="mt-2 text-sm text-gray-500 text-left">{text}</p>
    </div>
  );
};

export default ImpactCard;