import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ pageTopic, supportingText, icon, buttonText, isUserDrawerOpen, onClick, isMobile }) => {
  return (
    <div className="w-full mb-2 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold">{pageTopic}</h1>
        <p className="text-gray-600">{supportingText}</p>
      </div>
      <button 
        className={`z-20 px-4 py-2 bg-red-400 text-neutral-100 rounded-lg transition-all duration-300 ${!isMobile && isUserDrawerOpen ? 'mr-80' : ''}`}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {buttonText}
      </button>
    </div>
  )
};

export default Header;