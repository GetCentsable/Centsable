import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ searchValue, setSearchValue, onSearch, onClear, isSearching }) => {
  const handleClear = () => {
    onClear();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  return (
    <div className={`w-full max-w-2xl ${isSearching ? 'mx-auto flex justify-center' : ''}`}>
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;