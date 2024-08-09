import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

const AdminButton = ({ title, type = 'button', icon, onClick, className = '' }) => {
  const baseClasses = "py-2 px-3 h-10 flex items-center rounded-md transition-colors duration-200 border-2";

  let buttonClasses = twMerge(
    baseClasses,
    `bg-red-400 text-white hover:bg-blue-600 hover:bg-red-600`,
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {title && <span>{title}</span>}
    </button>
  );
};

export default AdminButton;
