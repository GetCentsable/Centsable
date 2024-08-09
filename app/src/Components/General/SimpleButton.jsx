import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SimpleButton = ({ title, type, icon, onClick, className, optionalAttributes = null }) => {
  const baseClasses = "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 hover:text-white";

  return (
    <button
      type={type}
      className={twMerge(baseClasses, className)}
      onClick={(e) => onClick(e)}
      {...optionalAttributes}
    >
      {icon && <FontAwesomeIcon icon={icon} className='mr-2' />}
      {title}
    </button>
  );
};

export default SimpleButton;
