import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const QuickFilter = ({ filters, setSearchValue }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {filters.map((filter, index) => (
        <button
          key={index}
          onClick={() => setSearchValue(filter.title)}
          className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FontAwesomeIcon icon={filter.icon} className="mr-2" />
          {filter.title}
        </button>
      ))}
    </div>
  );
};

export default QuickFilter;