import SearchBar from '../Components/General/SearchBar';
import QuickFilter from '../Components/General/QuickFilter';
import { faMusic, faHandHoldingHeart, faVideo, faBuilding, faGamepad, faPodcast } from '@fortawesome/free-solid-svg-icons';

const Discover = () => {
  const filters = [
    { icon: faMusic, title: 'Music' },
    { icon: faHandHoldingHeart, title: 'Charities' },
    { icon: faVideo, title: 'Streamers' },
    { icon: faBuilding, title: 'Organizations' },
    { icon: faGamepad, title: 'Games' },
    { icon: faPodcast, title: 'Podcasts' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Change what matters most</h1>
      <SearchBar />
      <QuickFilter filters={filters} />
    </div>
  );
};

export default Discover;