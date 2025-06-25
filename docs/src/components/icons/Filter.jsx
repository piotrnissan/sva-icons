import React from 'react';

const Filter = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M21 1H3C1.9 1 1 1.9 1 3V21C1 22.1 1.9 23 3 23H21C22.1 23 23 22.1 23 21V3C23 1.9 22.1 1 21 1ZM7 19H5V17H7V19ZM7 13H5V11H7V13ZM7 7H5V5H7V7ZM19 19H9V17H19V19ZM19 13H9V11H19V13ZM19 7H9V5H19V7Z"/>
    </svg>
  );
};

Filter.displayName = 'Filter';

export default Filter;
