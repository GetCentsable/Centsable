// Card.jsx
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = ({ bank_name, account_name, mask }) => {
  const cardColor = {
    "Arvest Bank - Online Banking": "bg-blue-500",
    "Bank of America": "bg-red-600",
    "TFCU": "bg-blue-700",
    "Capital One": "bg-purple-600",
    "Apple Cash": "bg-purple-500",
    "Cash App": "bg-purple-400",
  }[bank_name] || "bg-gray-500";

  return (
    <div className="w-80 pb-10 max-w-sm mx-auto">
      <div className={`rounded-xl ${cardColor} text-white p-4 shadow-lg relative overflow-hidden h-48 mx`}>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-lg font-bold">{bank_name}</h2>
            <div className="rounded-lg bg-opacity-15 bg-white px-2 py-1">
              <FontAwesomeIcon icon={faGear} className="text-white" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm mb-1">{account_name}</p>
            {/* <p className="text-sm">{expDate}</p> */}
          </div>
          <p className="text-sm mb-1">********{mask}</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <p>Donated this Month</p>
        {/* <p className="font-bold">${donated.toFixed(2)}</p> */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-1 mt-1">
          {/* <div 
            className={`${cardColor} rounded-full h-1`}
            style={{width: `${Math.min((donated / limit) * 100, 100)}%`}}
          ></div> */}
        </div>
      </div>
    </div>
  );
};

export default Card;