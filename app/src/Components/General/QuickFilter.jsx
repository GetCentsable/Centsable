import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const QuickFilter = ({ filters, onSearch }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {filters.map((filter, index) => (
        <button
          key={index}
          onClick={() => onSearch(filter.title)}
          className="px-4 py-2 rounded-full border border-gray-300 hover:bg-red-400 hover:text-white focus:outline-none"
        >
          <FontAwesomeIcon icon={filter.icon} className="mr-2" />
          {filter.title}
        </button>
      ))}
    </div>
  );
};

export default QuickFilter;