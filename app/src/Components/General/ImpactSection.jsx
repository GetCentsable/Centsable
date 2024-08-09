import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import ImpactCards from './ImpactCards';

// Dummy Data Images
import coinsGrowth from '../../assets/coinsGrowth.png'
import disasterRelief from '../../assets/disasterRelief.png'
import studentLife from '../../assets/studentLife.png'
import dereksOrphanage from '../../assets/dereksOrphanage.png'
import coachClint from '../../assets/coachClint.png'
import chefPodcast from '../../assets/chefPodcast.png'
import libbyForPrez from '../../assets/libbyForPrez2.png'
import maxSka from '../../assets/maxSka.png'
import meganBabysitting from '../../assets/meganBabysitting.png'
import taylorSwiftCake from '../../assets/taylorSwiftCake.png'
import danielsLaboratory from '../../assets/danielsLaboratory.png'
import anthonysAwesomePhotos from '../../assets/anthonysAwesomePhotos.png'




const ImpactSection = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['Personal', 'Tulsa', 'All'];
  const impactCards = [
    { image: libbyForPrez, head: 'Libby for Prez - Reached 5000 Campaign Donors', categories: ['Tulsa', 'Personal'], text: 'We reached 5,000 donors and are ready to take on the universe!' },
    { image: dereksOrphanage, head: 'Derek\'s Happy Sun Orphanage', categories: ['Personal'], text: 'Providing a loving home to 50 robot children!' },
    { image: chefPodcast, head: 'Tales from a Former Chef', categories: ['Oklahoma City', 'Personal'], text: 'Chef Silas is starting a fund for our very first recipe book! Let\'s get cooking!' },
    { image: maxSka, head: 'Maxximum Skaaa!', categories: ['Oklahoma City'], text: 'Reached our goal to record a new EP! Skaaa-tastic tunes coming your way!' },
    { image: danielsLaboratory, head: 'Daniel\'s Laboratory - Clone Conquest', categories: ['Personal', 'Tulsa'], text: 'Cloned our first intern. Twice the coffee runs, twice the fun!' },
    { image: studentLife, head: 'Atlas Student Life Commitee - Reached 200 Donors', categories: ['Tulsa'], text: 'We are not a cult' },
    { image: meganBabysitting, head: 'Megan\'s babysitting - World Record Achieved', categories: ['Oklahoma City', 'Personal'], text: 'Recognized by the Guiness World Records for juggling 10 kids at once without dropping a single one!' },
    { image: coachClint, head: 'Coach Clint - One Hundred Club', categories: ['Personal'], text: 'Celebrating 100 episodes with Tom Brady on ‘Winning at Life: Strategies for Success!’' },
    { image: taylorSwiftCake, head: 'Lydia\'s Taylor Swift Bakery - Bake It Off', categories: ['Tulsa', 'Personal'], text: 'Creating a life-size cake of Taylor Swift! Edible superstar incoming!' },
    { image: anthonysAwesomePhotos, head: 'Anthony\'s Photography - Goal Funded', categories: ['Oklahoma City'], text: 'Raised enough to rent gallery space' },
    { image: coinsGrowth, head: 'Centsable Milestone', categories: ['Personal', 'Tulsa'], text: 'We hit our first 10,000 users!' },
    { image: disasterRelief, head: 'Disaster Relief Feeds Thousands', categories: ['Tulsa'], text: 'We were able to provide hot meals and water to the people of Delta City' },
  ];



  const filteredCards = impactCards.filter(card => 
    selectedCategory === 'All' || card.categories.includes(selectedCategory)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 ${
                selectedCategory === category ? 'text-red-400 border-b-2 border-red-400' : 'text-black'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {filteredCards.map((card, index) => (
          <SwiperSlide key={index}>
            <ImpactCards 
              image={card.image}
              head={card.head}
              text={card.text}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImpactSection;