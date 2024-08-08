import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../Context/UserContext';

const EditPercentages = ({ onSave, onCancel }) => {
  const { recipientPreference } = useContext(UserContext);
  const [editedCommunities, setEditedCommunities] = useState(recipientPreference);
  const [totalPercentage, setTotalPercentage] = useState(100);
  const [originalCommunities, setOriginalCommunities] = useState(recipientPreference);

  useEffect(() => {
    // console.log(recipientPreference)
    setEditedCommunities(recipientPreference);
    setOriginalCommunities(recipientPreference);
  }, [recipientPreference]);

  const handleSliderChange = (index, newValue) => {
    const roundedValue = Math.round(newValue / 5) * 5;
    let updatedCommunities = [...editedCommunities];
    const oldValue = updatedCommunities[index].percentage;
    const difference = roundedValue - oldValue;

    // Adjust other percentages to maintain total of 100%
    if (totalPercentage + difference <= 100) {
      updatedCommunities[index].percentage = roundedValue;
      
      // Distribute the difference among other communities
      const remainingDifference = -difference;
      const otherCommunities = updatedCommunities.filter((_, i) => i !== index);
      let remainingTotal = otherCommunities.reduce((sum, community) => sum + community.percentage, 0);

      otherCommunities.forEach((community, i) => {
        const adjustedPercentage = Math.max(0, community.percentage - (community.percentage / remainingTotal) * remainingDifference);
        updatedCommunities[updatedCommunities.findIndex(c => c.name === community.name)].percentage = Math.round(adjustedPercentage / 5) * 5;
      });
    }

    const newTotal = updatedCommunities.reduce((sum, community) => sum + community.percentage, 0);
    setTotalPercentage(newTotal);
    setEditedCommunities(updatedCommunities);
  };

  const handleSave = () => {
    if (totalPercentage === 100) {
      onSave(editedCommunities);
    } else {
      alert('Total percentage must equal 100%');
    }
  };

  const handleCancel = () => {
    setEditedCommunities(originalCommunities);
    setTotalPercentage(100);
    onCancel();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow relative h-full">
      <h3 className="font-bold text-lg mb-4">Adjust Percentages</h3>
      {editedCommunities.map((community, index) => (
        <div key={community.recipient_name} className="my-4 pb-2 border-b">
          <div className='flex text-nowrap justify-between items-end'>
            <label className="p-0 m-0 block text-sm font-medium text-gray-700">
              {community.recipient_name}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={community.percentage}
              onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
              className="w-2/5 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={totalPercentage === 100 && community.percentage === 0}
            />
          </div>
          <span className="text-sm text-gray-600">{community.percentage}%</span>
        </div>
      ))}
      <div className="mt-4">
        <p className={`text-sm ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
          Total: {totalPercentage}%
        </p>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={totalPercentage !== 100}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPercentages;