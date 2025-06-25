import React from 'react';

const CheckedBox = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M21 1H3C1.9 1 1 1.9 1 3V21C1 22.1 1.9 23 3 23H21C22.1 23 23 22.1 23 21V3C23 1.9 22.1 1 21 1ZM9.654 16.903L4.989 12.237L5.908 11.318L9.654 15.064L17.811 6.908L18.73 7.827L9.654 16.903Z"/>
    </svg>
  );
};

CheckedBox.displayName = 'CheckedBox';

export default CheckedBox;
