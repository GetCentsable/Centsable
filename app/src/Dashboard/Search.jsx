import { useState, useContext } from 'react';
import SearchBar from '../Components/General/SearchBar';
import QuickFilter from '../Components/General/QuickFilter';
import SearchResults from '../Components/General/SearchResults';
import { faMusic, faHandHoldingHeart, faVideo, faBuilding, faGamepad, faPodcast } from '@fortawesome/free-solid-svg-icons';
import { app } from '../Firebase/firebase'; 
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import UserContext from '../Context/UserContext';

const Search = ({ isUserDrawerOpen }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const {user} = useContext(UserContext);

  const db = getFirestore(app);

  const handleSearch = async (value) => {
    setSearchValue(value);
    setIsSearching(value.length > 0);
    // Here you would typically fetch search results based on the value
    // For now, we'll use dummy data
    if (value.length > 0) {
      try {
        // Query the recipients collection based on the search value
        const q = query(
          collection(db, 'recipients')//,
          // where('name', '>=', value),
          // where('name', '<=', value + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);

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
    } else {
      setSearchResults([]);
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
    <div className={`flex flex-col items-center ${isSearching ? 'pt-20' : 'pt-60'} min-h-screen p-4 transition-all duration-300`}>
      {!isSearching && <h1 className="text-3xl font-bold mb-8">Find Your Cause</h1>}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={handleSearch}
        onClear={handleClearSearch}
        isSearching={isSearching}
        isUserDrawerOpen={isUserDrawerOpen}
      />
      {!isSearching && <QuickFilter filters={filters} setSearchValue={handleSearch} />}
      {isSearching && <SearchResults results={searchResults} />}
    </div>
  );
};

export default Search;