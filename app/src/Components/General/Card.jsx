import React, { useState, useRef } from 'react';
import { faGear, faTimes, faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFlip } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-flip';

const Card = ({ bank_name, account_name, mask, onRemove, onChangeColor }) => {
  const [cardColor, setCardColor] = useState(
    {
      "Arvest Bank - Online Banking": "bg-blue-500",
      "Bank of America": "bg-red-600",
      "TFCU": "bg-blue-700",
      "Capital One": "bg-purple-600",
      "Apple Cash": "bg-purple-500",
      "Cash App": "bg-purple-400",
    }[bank_name] || "bg-gray-500"
  );

  const swiperRef = useRef(null);
  const [removeText, setRemoveText] = useState('');

  const handleFlip = (e) => {
    e.stopPropagation();
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleBack = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleRemove = () => {
    if (removeText.toLowerCase() === 'remove') {
      onRemove();
      handleBack();
    }
  };

  const handleChangeColor = (color) => {
    setCardColor(color);
    onChangeColor(color);
  };

  const colorOptions = [
    'bg-blue-500', 'bg-red-600', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-600', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
  ];

  return (
    <div className="w-80 pb-10 max-w-sm mx-auto">
      <Swiper
        ref={swiperRef}
        effect={'flip'}
        allowTouchMove={true}
        modules={[EffectFlip]}
        className="h-full w-full"
      >
        <SwiperSlide>
          <div className={`rounded-xl ${cardColor} text-white p-4 shadow-lg relative overflow-hidden h-48 mx`}>
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full"></div>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-lg font-bold">{bank_name}</h2>
                <div className="rounded-lg bg-opacity-15 bg-white px-2 py-1 cursor-pointer" onClick={handleFlip}>
                  <FontAwesomeIcon icon={faGear} className="text-white" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm mb-1">{account_name}</p>
              </div>
              <p className="text-sm mb-1">********{mask}</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={`rounded-xl ${cardColor} text-white p-4 shadow-lg relative overflow-hidden h-48 mx flex flex-col justify-start items-center`}>
            <button onClick={handleBack} className="absolute top-2 right-2 text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="mb-4 mt-4">
              <input
                type="text"
                placeholder="Type 'Remove' to delete"
                value={removeText}
                onChange={(e) => setRemoveText(e.target.value)}
                className="px-2 py-1 text-black rounded"
              />
              <button onClick={handleRemove} className="ml-2 bg-red-500 px-2 py-1 rounded">
                Remove
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-2">Change Color:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white shadow-md transition-transform hover:scale-110`}
                    onClick={() => handleChangeColor(color)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="mt-4 text-sm">
        <p>Donated this Month</p>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-1 mt-1">
        </div>
      </div>
    </div>
  );
};

export default Card;