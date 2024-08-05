import React from 'react';
import PieChart from './PieChart';
import CommunitiesList from './CommunitiesList';

const PieChartSection = ({ weeklyTotal, communities, onClick }) => (
  <div className="bg-white p-6 rounded-lg shadow cursor-pointer md:cursor-default relative h-auto" onClick={onClick}>
    <button 
      className="absolute top-2 right-2 bg-red-400 text-white rounded-lg w-8 h-8 flex items-center justify-center focus:outline-none hover:bg-red-500 transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation();
        // Add your button click handler here
        console.log('Ellipsis button clicked');
      }}
    >
      <span className="text-lg font-bold">...</span>
    </button>
    <div className="mb-8">
      <PieChart total={Number(weeklyTotal)} communities={communities} />
    </div>
    <div className="border-t pt-6">
      <h3 className="font-bold text-lg mb-4">Communities</h3>
      <CommunitiesList communities={communities} />
    </div>
  </div>
);

export default PieChartSection;