import React from 'react';

const EngineOil = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M13 4H6C5.448 4.002 5.002 4.448 5 5V23C5.002 23.552 5.448 23.998 6 24H18C18.552 23.998 18.998 23.552 19 23V10L13 4ZM12 20C10.068 19.998 8.502 18.432 8.5 16.5C8.5 14 12 8 12 8C12 8 15.5 14 15.5 16.5C15.498 18.432 13.932 19.998 12 20ZM12 3H6V1C6.002 0.448 6.448 0.002 7 0H11C11.552 0.002 11.998 0.448 12 1V3Z"/>
    </svg>
  );
};

EngineOil.displayName = 'EngineOil';

export default EngineOil;
