import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

const AdminButton = ({ title, type = 'button', icon, onClick, className = '' }) => {
  const baseClasses = "py-2 px-4 h-12 flex items-center rounded-md transition-colors duration-200 border-2";

  let buttonClasses = twMerge(
    baseClasses,
    `bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100`,
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-3" />}
      {title && <span>{title}</span>}
    </button>
  );
};

export default AdminButton;
