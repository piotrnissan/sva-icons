import React from 'react';

const Assistance = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M13.685 12.577C12.71 11.031 10.991 10 9.027 10C7.063 10 5.344 11.031 4.369 12.577L0.975 18H17.079L13.685 12.577ZM23 0H15C14.45 0 14 0.45 14 1V9.626C14 10.093 14.583 10.305 14.883 9.947L16.517 8H23C23.55 8 24 7.55 24 7V1C24 0.45 23.55 0 23 0ZM9 9C10.933 9 12.5 7.433 12.5 5.5C12.5 3.567 10.933 2 9 2C7.067 2 5.5 3.567 5.5 5.5C5.5 7.433 7.067 9 9 9ZM0 23H22V19H0V23Z"/>
    </svg>
  );
};

Assistance.displayName = 'Assistance';

export default Assistance;
