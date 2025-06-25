import React from 'react';

const PowerOn = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M11 9V1C11 0.448 11.448 0 12 0C12.552 0 13 0.448 13 1V9C13 9.552 12.552 10 12 10C11.448 10 11 9.552 11 9ZM15 1.42V3.52C18.525 4.793 21 8.11 21 12.005C21 16.976 16.971 21.005 12 21.005C7.029 21.005 3 16.976 3 12.005C3 8.11 5.475 4.793 8.937 3.54L9 3.52V1.42C4.345 2.771 1 6.996 1 12.003C1 18.078 5.925 23.003 12 23.003C18.075 23.003 23 18.078 23 12.003C23 6.996 19.655 2.771 15.078 1.439L15 1.42Z"/>
    </svg>
  );
};

PowerOn.displayName = 'PowerOn';

export default PowerOn;
