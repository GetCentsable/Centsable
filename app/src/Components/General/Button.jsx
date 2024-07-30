import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

const Button = ({ title, type, icon, onClick, isSelected, isNavButton, isOpen, className = '' }) => {
  const baseClasses = "py-2 px-4 h-12 flex items-center rounded-md transition-colors duration-200";
  
  let buttonClasses = twMerge(
    baseClasses,
    isNavButton
      ? `w-full ${isOpen ? 'justify-start' : 'justify-center'} 
         ${isSelected 
           ? 'bg-red-400 text-white' 
           : 'bg-neutral-100 text-slate-700 hover:text-white hover:bg-red-400'}`
      : 'w-full border border-transparent text-sm font-medium text-white bg-red-400',
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon icon={icon} className={isNavButton && isOpen ? 'mr-3' : ''} />}
      {(title && (!isNavButton || isOpen)) && <span>{title}</span>}
    </button>
  )
};

export default Button;