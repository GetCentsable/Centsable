import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserDrawer = ({ userUsername, isOpen, onClose }) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-screen bg-red-400 transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-0'
      } flex flex-col overflow-hidden`}
    >
      <div className="flex-grow p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onClose}
            className="p-2 flex items-center justify-center text-white rounded-full transition-all duration-100"
          >
            <FontAwesomeIcon 
              icon={faCircleXmark}
              size="xl"
              className="rotate-180"
            />
          </button>
          <h2 className="text-white text-xl ml-2">User Settings</h2>
        </div>

        <div className="flex items-center mb-6">
          <img src="https://picsum.photos/100/100" alt="User avatar" className="w-16 h-16 rounded-full" />
          <div className="ml-3">
            <p className="text-slate-700 font-semibold">{userUsername}</p>
          </div>
        </div>

        {/* Placeholder for settings components */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-slate-700">
            <span>Light Mode</span>
            <div className="w-12 h-6 bg-gray-400 rounded-full p-1 cursor-pointer">
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"></div>
            </div>
          </div>
          {/* Add more settings components here */}
        </div>
      </div>
    </div>
  );
};

export default UserDrawer;