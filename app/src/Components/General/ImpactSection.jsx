import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ImpactSection = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['Personal', 'Tulsa', 'All'];
  const updates = [
    { title: 'Update 1', content: 'Content for update 1' },
    { title: 'Update 2', content: 'Content for update 2' },
    { title: 'Update 3', content: 'Content for update 3' },
    { title: 'Update 4', content: 'Content for update 4' },
    { title: 'Update 5', content: 'Content for update 5' },
    { title: 'Update 6', content: 'Content for update 6' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 ${
                selectedCategory === category ? 'text-red-400 border-b-2-red-400' : 'text-black'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {updates.map((update, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold">{update.title}</h3>
              <p>{update.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImpactSection;