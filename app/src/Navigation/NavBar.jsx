import { useState, useContext, useEffect } from 'react';
import { faHome, faHistory, faWallet, faSearch, faArrowRightFromBracket, faForwardStep, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Components/General/Button';
import UserDrawer from '../Components/General/UserDrawer';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../Context/UserContext';
import { app } from '../Firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';

const NavBar = ({ isOpen, toggleNavBar, isUserDrawerOpen, toggleUserDrawer, selectedItem, setSelectedItem }) => {
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);  // New state for mobile nav
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) {
        setIsMobileNavOpen(false);  // Close mobile nav when switching to desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {}, [user]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTimestamp');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { icon: faHome, title: 'Home' },
    { icon: faSearch, title: 'Search' },
    { icon: faHistory, title: 'Donations' },
    { icon: faWallet, title: 'Accounts' }
  ];

  const renderNavContent = () => (
    <>
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Link
            to={`/${item.title.toLowerCase()}`}
            key={index}
            className="block mb-2 last:mb-0"
            onClick={() => {
              setSelectedItem(item.title);
              if (isMobile) {
                setIsMobileNavOpen(false);
                if (isUserDrawerOpen) toggleUserDrawer();
              }
            }}
          >
            <Button
              key={index}
              icon={item.icon}
              title={item.title}
              isSelected={selectedItem === item.title}
              isNavButton={true}
              isOpen={isMobile ? isMobileNavOpen : isOpen}
              className="my-custom-class" 
            />
          </Link>
        ))}
      </nav>
    </>
  );

  const handleUserDrawerToggle = () => {
    if (isMobile) {
      if (isMobileNavOpen) {
        setIsMobileNavOpen(false);  // Close NavBar if it's open
      }
      toggleUserDrawer(); // Toggle UserDrawer
    } else {
      toggleUserDrawer(); // Just toggle UserDrawer for desktop
    }
  };

  const handleNavBarToggle = () => {
    if (isMobile) {
      if (isUserDrawerOpen) {
        toggleUserDrawer(); // Close UserDrawer if it's open
      }
      setIsMobileNavOpen(!isMobileNavOpen);  // Toggle mobile nav
    } else {
      toggleNavBar(); // Toggle NavBar for desktop
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="fixed top-0 left-0 right-0 h-16 bg-slate-700 flex items-center justify-between px-4 z-50">
            <button onClick={handleNavBarToggle} className="text-white">
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            <img src="" alt="Logo" className="h-8" />
            <button onClick={handleUserDrawerToggle} className="text-white">
              <img src="https://picsum.photos/100/100" alt="User avatar" className="w-12 h-12 rounded-full" />
            </button>
          </div>
          <div className={`fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-slate-700 transition-transform duration-300 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} z-40 overflow-y-auto`}>
            <div className="h-full p-4">
              {renderNavContent()}
            </div>
          </div>
          {/* Add a spacer div to push content below the fixed navbar */}
          <div className="h-16"></div>
        </>
      ) : (
        <div className={`fixed top-0 left-0 h-screen bg-slate-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-18'} flex flex-col z-40`}>
          <div className="flex-grow p-4">
            <img src={`${isOpen ? '' : ''}`} alt='L' className='-24 mx-auto mb-6' />
            {renderNavContent()}
          </div>
          <div className="mt-auto">
            <div className={`w-full flex ${isOpen ? 'justify-end pr-4' : 'justify-center'}`}>
              <button onClick={handleNavBarToggle} className={`p-2 pb-6 flex items-center justify-center text-white rounded-full transition-all duration-100 ${isOpen ? 'mr-[-8px]' : ''}`}>
                <FontAwesomeIcon icon={faForwardStep} size="xl" className={`transition-transform duration-100 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="border-t border-slate-600" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center" onClick={handleUserDrawerToggle}>
                <img src="https://picsum.photos/100/100" alt="User avatar" className="w-10 h-10 rounded-full" />
                {isOpen && user && (
                  <div className="ml-3">
                    <p className="text-neutral-200 font-semibold">{user.displayName}</p>
                    <p className="text-neutral-400 text-xs">{user.email}</p>
                  </div>
                )}
              </div>
              {isOpen && (
                <button onClick={handleSignOut} className="text-red-400 hover:text-red-500 cursor-pointer bg-transparent border-none p-0">
                  <FontAwesomeIcon icon={faArrowRightFromBracket} size="xl" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <UserDrawer 
        isOpen={isUserDrawerOpen} 
        onClose={handleUserDrawerToggle} 
        user={user}
        handleSignOut={handleSignOut}
        isMobile={isMobile}
      />
    </>
  );
};

export default NavBar;