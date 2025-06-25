import React from 'react';

const Brake = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M18 14L20 16L12 24L4 16L6 14L12 20L18 14ZM20 8L18 6L13.5 10.5V0H10.5V10.5L6 6L4 8L12 16L20 8Z"/>
    </svg>
  );
};

Brake.displayName = 'Brake';

export default Brake;
