import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const AboutUsModal = ({ isOpen, onClose, data }) => {
  const { aboutUsTitle, teamPhotos, aboutUsText, linkedIn } = data;
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 pt-6 flex items-center justify-center text-red-400 rounded-full transition-all duration-100 hover:text-red-600"
        >
          <FontAwesomeIcon 
            icon={faCircleXmark}
            size="2x"
          />
        </button>
        <div className="p-6 pt-12">
          <h2 className="text-3xl font-bold mb-4">{aboutUsTitle}</h2>
          
          {aboutUsText && (
            <div className="mb-6">
              {aboutUsText.map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          )}

          {teamPhotos && teamPhotos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Our Team</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                {teamPhotos.map((member, index) => (
                  <div key={index} className="flex flex-col items-center w-32">
                    <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="text-center">
                      <div className="w-24 h-24 mb-2 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <h4 className="font-semibold text-nowrap">{member.name}</h4>
                    </a>
                    <p className="text-sm text-gray-600 text-center text-nowrap">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;