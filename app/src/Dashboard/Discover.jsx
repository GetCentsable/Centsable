import { useState } from 'react';
import SearchBar from '../Components/General/SearchBar';
import QuickFilter from '../Components/General/QuickFilter';
import SearchResults from '../Components/General/SearchResults';
import { faMusic, faHandHoldingHeart, faVideo, faBuilding, faGamepad, faPodcast } from '@fortawesome/free-solid-svg-icons';

const Discover = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (value) => {
    setSearchValue(value);
    setIsSearching(value.length > 0);
    // Here you would typically fetch search results based on the value
    // For now, we'll use dummy data
    setSearchResults(Array(100).fill().map((_, i) => ({
      id: i,
      header: `Result ${i + 1}`,
      description: `This is the description for result ${i + 1}`
    })));
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const filters = [
    { icon: faMusic, title: 'Music' },
    { icon: faHandHoldingHeart, title: 'Charities' },
    { icon: faVideo, title: 'Streamers' },
    { icon: faBuilding, title: 'Organizations' },
    { icon: faGamepad, title: 'Games' },
    { icon: faPodcast, title: 'Podcasts' }
  ];



  return (
    <div className={`flex flex-col items-center ${isSearching ? 'pt-20' : 'pt-60'} min-h-screen p-4 transition-all duration-300`}>
      {!isSearching && <h1 className="text-3xl font-bold mb-8">Change what matters most</h1>}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={handleSearch}
        onClear={handleClearSearch}
        isSearching={isSearching}
      />
      {!isSearching && <QuickFilter filters={filters} setSearchValue={handleSearch} />}
      {isSearching && <SearchResults results={searchResults} />}
    </div>
  );
};

export default Discover;