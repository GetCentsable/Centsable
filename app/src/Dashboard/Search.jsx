import { useState, useContext } from 'react';
import SearchBar from '../Components/General/SearchBar';
import QuickFilter from '../Components/General/QuickFilter';
import SearchResults from '../Components/General/SearchResults';
import { faMusic, faHandHoldingHeart, faVideo, faBuilding, faGamepad, faPodcast } from '@fortawesome/free-solid-svg-icons';
import { app } from '../Firebase/firebase'; 
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import UserContext from '../Context/UserContext';

const Search = ({ isUserDrawerOpen, isMobile }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const {user} = useContext(UserContext);

  const db = getFirestore(app);

  const handleSearch = async (value) => {
    setSearchValue(value);
    setIsSearching(true);
    try {
      const q = query(collection(db, 'recipients'));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        header: doc.data().name,
        description: doc.data().description,
        website: doc.data().website,
        category: doc.data().category
      }));
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
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
    <div className="flex flex-col items-center min-h-screen p-2 sm:p-4">
      <div className={`w-full max-w-2xl ${isSearching ? 'top-0 left-0 right-0 p-2 sm:p-4' : 'mt-20 sm:mt-60'}`}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Find Your Cause</h1>
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
          isUserDrawerOpen={isUserDrawerOpen}
        />
        {!isSearching && <QuickFilter filters={filters} onSearch={handleSearch} />}
      </div>
      {isSearching && (
        <div className="w-full max-w-2xl mt-4 mb-16">
          <SearchResults results={searchResults} />
        </div>
      )}
    </div>
  );
};

export default Search;