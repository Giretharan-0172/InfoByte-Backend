import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-accent-blue hover:bg-blue-600 text-white',
    secondary: 'bg-navy-700 hover:bg-navy-600 text-white',
    ghost: 'bg-transparent hover:bg-navy-700 text-gray-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-medium transition-colors
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}