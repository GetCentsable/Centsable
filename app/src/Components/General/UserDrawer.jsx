import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserDrawer = ({ user, isOpen, onClose, handleSignOut, isMobile }) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-screen bg-red-400 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isMobile ? 'w-full' : 'w-80'} flex flex-col overflow-hidden ${isMobile ? 'z-[60]' : 'z-50'}`}
      style={{ top: isMobile ? '4rem' : '0' }}  // Adjust top position for mobile
    >
      <div className="flex-grow p-4">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl">User Settings</h2>
            <button
              onClick={onClose}
              className="p-2 flex items-center justify-center text-white rounded-full transition-all duration-100"
            >
              <FontAwesomeIcon 
                icon={faCircleXmark}
                size="xl"
              />
            </button>
          </div>

          <div className="flex items-center">
            <img src="https://picsum.photos/100/100" alt="User avatar" className="w-16 h-16 rounded-full" />
            <div className="ml-3">
              <p className="text-slate-700 font-semibold">{user?.displayName}</p>
              <p className="text-slate-600 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-700">
              <span>Light Mode</span>
              <div className="w-12 h-6 bg-gray-400 rounded-full p-1 cursor-pointer">
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"></div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSignOut} 
            className="w-full bg-slate-700 text-white py-2 rounded-md hover:bg-slate-600 transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDrawer;