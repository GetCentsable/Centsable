import { useState, useContext, useEffect } from 'react';
import SearchBar from '../Components/General/SearchBar';
import QuickFilter from '../Components/General/QuickFilter';
import SearchResults from '../Components/General/SearchResults';
import { faMusic, faHandHoldingHeart, faVideo, faBuilding, faGamepad, faPodcast, faUsersBetweenLines } from '@fortawesome/free-solid-svg-icons';
import { app } from '../Firebase/firebase'; 
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import UserContext from '../Context/UserContext';
import Modal from '../Components/General/Modal';

const Search = ({ isUserDrawerOpen, isMobile }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const { recipientsLoaded, recipientPreference } = useContext(UserContext);

  const db = getFirestore(app);

  // Helper functions parses string to remove '-' and capitilize words
  const removeDash = (category) => {
    return category
      .split('-') // Split the string by '-'
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words with a space
  };

  const addDash = (category) => {
    return category
      .split(' ') // Split the string by spaces
      .map(word => word.toLowerCase()) // Lowercase each word
      .join('-'); // Join the words with a dash
  };

  // Triggers handle search again to update preferences
  useEffect(() => {
    if (searchValue !== '') {
      handleSearch(searchValue);
    }
  },[recipientsLoaded])

  const handleSearch = async (value) => {
    const lowerCaseValue = addDash(value);
    // console.log('Search value selected:', lowerCaseValue);
    setSearchValue(lowerCaseValue);
    setIsSearching(true);
    try {
      const q = query(collection(db, 'recipients'), where('category', '==', lowerCaseValue));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        setSearchResults([]);
      } else {
        const results = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const isSelected = recipientPreference.some(pref => pref.recipient_id === doc.id);
          // console.log(`${data.name} is selected: ${isSelected}`);
          return {
            id: doc.id,
            header: data.name,
            description: data.description,
            website: data.website,
            category: removeDash(data.category),
            isSelected: isSelected
          };
        });
        setSearchResults(results);
        // console.log(recipientPreference);
      }
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
    { icon: faBuilding, title: 'For Profit' },
    { icon: faBuilding, title: 'Non Profit' },
    { icon: faGamepad, title: 'Games' },
    { icon: faPodcast, title: 'Podcasts' },
    { icon: faUsersBetweenLines, title: 'Clubs' },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-2 sm:p-4">
      <div className={`w-full max-w-2xl ${isSearching ? 'top-0 left-0 right-0 p-2 sm:p-4' : 'mt-20 sm:mt-60'}`}>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage('')} />}
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
      {!recipientsLoaded ? (
          <div className="loading-spinner-container mt-20 mb-12 flex items-center justify-center h-full">
            <div role="status">
              <svg aria-hidden="true" className="inline w-36 h-36 text-gray-200 animate-spin dark:text-neutral-300 fill-red-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          isSearching && (
            <div className="w-full max-w-2xl mt-4 mb-16">
              <SearchResults results={searchResults} setModalMessage={setModalMessage} />
            </div>
          )
        )
      }
    </div>
  );
};

export default Search;