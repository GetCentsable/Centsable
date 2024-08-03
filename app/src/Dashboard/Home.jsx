import Header from '../Components/General/Header';
import PieChart from '../Components/General/PieChart';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const HomePage = ({ isUserDrawerOpen }) => {
  const contributions = [
    {
      title: "Personal",
      total: 2.45,
      communities: [
        { name: "Community A", percentage: 50 },
        { name: "Community B", percentage: 30 },
        { name: "Community C", percentage: 20 },
      ]
    },
    {
      title: "Tulsa",
      total: 10094,
      communities: [
        { name: "Community X", percentage: 40 },
        { name: "Community Y", percentage: 35 },
        { name: "Community Z", percentage: 25 },
      ]
    },
    {
      title: "All",
      total: 24230,
      communities: [
        { name: "Community 1", percentage: 30 },
        { name: "Community 2", percentage: 25 },
        { name: "Community 3", percentage: 20 },
        { name: "Community 4", percentage: 15 },
        { name: "Community 5", percentage: 10 },
      ]
    }
  ];

  return (
    <div className="p-6">
      <Header 
        pageTopic="Your Impact"
        icon={faMagnifyingGlass}
        buttonText="View All"
        isUserDrawerOpen={isUserDrawerOpen}
      />
      <div className="pt-14 max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold mr-4">Your Impact</h1>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-red-400 text-white rounded-full">Personal</button>
            <button className="px-3 py-1 bg-gray-200 rounded-full">Tulsa</button>
            <button className="px-3 py-1 bg-gray-200 rounded-full">All</button>
          </div>
        </div>
      </div>
      <div className="pt-14 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Contributions</h1>
        <div className="hidden md:flex md:flex-col lg:flex-row justify-between items-center">
          {contributions.map((contrib, index) => (
            <div key={index} className="w-full md:w-1/3 p-4">
              <PieChart total={contrib.total} communities={contrib.communities} />
              <h3 className="text-center font-bold">{contrib.title}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-14 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Featured</h1>
        <div className="bg-white p-4 rounded-lg">
        </div>
      </div>
    </div>
  );
};

export default HomePage;