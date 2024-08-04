import React from 'react';

const FeaturedSection = () => {
  const featuredGroups = [
    { name: 'Group 1', description: 'Short description for Group 1' },
    { name: 'Group 2', description: 'Short description for Group 2' },
    { name: 'Group 3', description: 'Short description for Group 3' },
  ];

  return (
    <div className="pt-14 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Featured</h1>
      <div className="bg-white p-4 rounded-lg">
        {featuredGroups.map((group, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h3 className="font-bold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
            </div>
            {index < featuredGroups.length - 1 && (
              <div className="border-b border-red-400 my-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;