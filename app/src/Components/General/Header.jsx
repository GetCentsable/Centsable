import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ pageTopic, supportingText, icon, buttonText }) => {
  return (
    <div className="mb-6 flex row-auto justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pageTopic}</h1>
          <p className="text-gray-600">{supportingText}</p>
        </div>
        <button className="mt-2 px-4 py-2 bg-red-400 text-neutral-100 rounded-lg">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          {buttonText}
        </button>
      </div>
  )
};

export default Header;