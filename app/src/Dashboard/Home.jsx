import Header from '../Components/General/Header';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const HomePage = () => {
  return (
    <div className="p-6">
      <Header 
        pageTopic="Your Impact"
        icon={faMagnifyingGlass}
        buttonText="View All"
      />
    </div>
  );
};

export default HomePage;