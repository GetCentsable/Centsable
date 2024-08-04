import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/General/Header';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ImpactSection from '../Components/General/ImpactSection';
import ContributionsSection from '../Components/General/ContributionsSection';
import FeaturedSection from '../Components/General/FeaturedSection';

const HomePage = ({ isUserDrawerOpen, setSelectedNavItem }) => {
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const navigate = useNavigate();

  const handleViewAll = () => {
    setSelectedNavItem('Search');
    navigate('/search');
  };

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
        onClick={handleViewAll}
      />
      
      <ImpactSection 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      
      <ContributionsSection 
        selectedCategory={selectedCategory} 
        contributions={contributions}
      />
      
      <div className="hidden lg:block">
        <FeaturedSection />
      </div>
    </div>
  );
};

export default HomePage;