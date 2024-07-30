import { useState, useContext } from 'react';
import { faHome, faHistory, faWallet, faSearch, faArrowRightFromBracket, faForwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Components/General/Button';
import UserDrawer from '../Components/General/UserDrawer';
import { Link } from 'react-router-dom';
import UserContext from '../Context/UserContext';
import { app } from '../Firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState('Home');
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);

  // Create instance of firebase auth
  const auth = getAuth(app);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserDrawer = () => {
    setIsUserDrawerOpen(!isUserDrawerOpen);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      // Sign out with firebase auth
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTimestamp');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { icon: faHome, title: 'Home' },
    { icon: faSearch, title: 'Discover' },
    { icon: faHistory, title: 'Donations' },
    { icon: faWallet, title: 'Accounts' }
  ];

  return (
    <>
      <div 
        className={`fixed top-0 left-0 h-screen bg-slate-700 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-18'
        } flex flex-col`}
      >
        <div className="flex-grow p-4">

          <img src={`${isOpen ? '' : ''}`} alt='L' className='-24 mx-auto mb-6' />

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <Link
                to={`/${item.title.toLowerCase()}`}
                key={index}
                className="block mb-2 last:mb-0"
              >
                <Button
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  onClick={() => setSelectedItem(item.title)}
                  isSelected={selectedItem === item.title}
                  isNavButton={true}
                  isOpen={isOpen}
                  className="my-custom-class" 
                />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <div className={`w-full flex ${isOpen ? 'justify-end pr-4' : 'justify-center'}`}>
            <button
              onClick={toggleNavBar}
              className={`p-2 pb-6 flex items-center justify-center text-white rounded-full transition-all duration-100 ${isOpen ? 'mr-[-8px]' : ''}`}
            >
              <FontAwesomeIcon 
                icon={faForwardStep}
                size="xl"
                className={`transition-transform duration-100 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          <div className="border-t border-slate-600" />

          <div className="p-4 flex items-center justify-between">
            <div
              className="flex items-center"
              onClick={toggleUserDrawer}  
            >
              {/* update user picture here */}
              <img src="https://picsum.photos/100/100" alt="User avatar" className="w-10 h-10 rounded-full" />
              {isOpen && user && (
                <div className="ml-3">
                  {/* <p className="text-neutral-200 font-semibold">{userUsername}</p> */}
                  <p className="text-neutral-400 text-sm">{user.email}</p>
                </div>
              )}
            </div>
            {isOpen && (
              <button
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-500 cursor-pointer bg-transparent border-none p-0"
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  size="xl"
                />
              </button>
            )}
          </div>
        </div>
        <UserDrawer
          // userUsername={userUsername}
          isOpen={isUserDrawerOpen}
          onClose={toggleUserDrawer}
        />
      </div>
    </>
  );
};

export default NavBar;
