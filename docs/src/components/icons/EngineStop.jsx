import React from 'react';

const EngineStop = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M13 8V16C13 16.552 12.552 17 12 17C11.448 17 11 16.552 11 16V8C11 7.448 11.448 7 12 7C12.552 7 13 7.448 13 8ZM23 12C23 18.075 18.075 23 12 23C5.925 23 1 18.075 1 12C1 5.925 5.925 1 12 1C12.002 1 12.004 1 12.006 1C18.078 1 23 5.922 23 11.994C23 11.996 23 11.998 23 12.001V12ZM21 12C21 7.029 16.971 3 12 3C7.029 3 3 7.029 3 12C3 16.971 7.029 21 12 21C16.967 20.992 20.992 16.967 21 12.001V12Z"/>
    </svg>
  );
};

EngineStop.displayName = 'EngineStop';

export default EngineStop;
