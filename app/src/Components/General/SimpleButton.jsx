import React from 'react';
import { twMerge } from 'tailwind-merge';

const SimpleButton = ({ title, type, icon, onClick, className, optionalAttributes = null }) => {
  const baseClasses = "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900";

  return (
    <button
      type={type}
      className={twMerge(baseClasses, className)}
      onClick={(e) => onClick(e)}
      icon={icon}
      {...optionalAttributes}
    >
      {title}
    </button>
  );
};

export default SimpleButton;
