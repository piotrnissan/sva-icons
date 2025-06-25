import React from 'react';

const CrossingBoutique = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M22 8H18V5C17.998 2.792 16.208 1.002 14 1H10C7.792 1.002 6.002 2.792 6 5V8H2C1.448 8 1 8.448 1 9V18C1 20.761 3.239 23 6 23H18C20.761 23 23 20.761 23 18V9C23 8.448 22.552 8 22 8ZM8 5C8.001 3.896 8.896 3.001 10 3H14C15.104 3.001 15.999 3.896 16 5V8H8V5Z"/>
    </svg>
  );
};

CrossingBoutique.displayName = 'CrossingBoutique';

export default CrossingBoutique;
