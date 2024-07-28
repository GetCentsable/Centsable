import React from 'react';


const Button = ({ title, type, icon, onClick }) => {
  return (
    <button
      type={type}
      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
      onClick={(e) => onClick(e)}
      icon={icon}
    >
      {title}
    </button>
  )
};

export default Button;