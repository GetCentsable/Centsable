import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import PieChart from './PieChart';
import CommunitiesList from './CommunitiesList';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-flip';

// import required modules
import { EffectFlip } from 'swiper/modules';

const ContributionCard = ({ contribution }) => {
  const swiperRef = useRef(null);

  const handleClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <Swiper
      ref={swiperRef}
      effect={'flip'}
      loop={true}
      grabCursor={true}
      modules={[EffectFlip]}
      className="h-full"
    >
      <SwiperSlide>
        <div className="bg-white p-4 rounded-lg h-full cursor-pointer" onClick={handleClick}>
          <PieChart total={contribution.total} communities={contribution.communities} />
          <h3 className="text-center font-bold mt-4">{contribution.title}</h3>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-white p-4 rounded-lg h-full cursor-pointer" onClick={handleClick}>
          <h3 className="text-center font-bold mb-4">{contribution.title}</h3>
          <CommunitiesList communities={contribution.communities} />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

const ContributionsSection = ({ selectedCategory, contributions }) => {
  const [selectedContribution, setSelectedContribution] = useState(contributions[0]);

  useEffect(() => {
    const newSelected = contributions.find(c => c.title === selectedCategory) || contributions[0];
    setSelectedContribution(newSelected);
  }, [selectedCategory, contributions]);

  return (
    <div className="pt-14 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Contributions</h1>
      
      {/* Large screens: Show all contributions with flip effect */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
        {contributions.map((contrib) => (
          <div key={contrib.title} className="h-[400px]">
            <ContributionCard contribution={contrib} />
          </div>
        ))}
      </div>
      
      {/* Medium screens (tablet): Show selected contribution's pie chart and community list side by side */}
      <div className="hidden md:flex lg:hidden h-[400px]">
        <div className="w-1/2 pr-4">
          <div className="bg-white p-4 rounded-lg h-full">
            <PieChart total={selectedContribution.total} communities={selectedContribution.communities} />
            <h3 className="text-center font-bold mt-4">{selectedContribution.title}</h3>
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <div className="bg-white p-4 rounded-lg h-full overflow-y-auto">
            <h3 className="text-center font-bold mb-4">{selectedContribution.title}</h3>
            <CommunitiesList communities={selectedContribution.communities} />
          </div>
        </div>
      </div>
      
      {/* Small screens: Show selected contribution with flip effect */}
      <div className="md:hidden h-[400px]">
        <ContributionCard contribution={selectedContribution} />
      </div>
    </div>
  );
};

export default ContributionsSection;