import React from 'react';

const Pandora = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M11.438 17.788H9.57301V22.024C9.56901 22.563 9.13101 22.999 8.59101 22.999H2.73901V0.999023H12.692C17.526 0.999023 21.264 3.49802 21.264 9.19402C21.264 14.591 17.113 17.78 11.46 17.78L11.438 17.788Z"/>
    </svg>
  );
};

Pandora.displayName = 'Pandora';

export default Pandora;
