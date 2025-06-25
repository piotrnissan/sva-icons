import React from 'react';

const Minus = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M21 14H3C1.896 14 1 13.104 1 12C1 10.896 1.896 10 3 10H21C22.104 10 23 10.896 23 12C23 13.104 22.104 14 21 14Z"/>
    </svg>
  );
};

Minus.displayName = 'Minus';

export default Minus;
