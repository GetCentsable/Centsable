import React from 'react';


const Input = ({ type, id, value, onChange, className}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none ${className}`}
    />
  )
};

export default Input;