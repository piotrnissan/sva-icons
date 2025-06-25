import React from 'react';

const Logout = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM11.35 4.5H12.65V12H11.35V4.5ZM12 19.5C7.858 19.5 4.5 16.142 4.5 12C4.5 9.318 5.912 6.971 8.029 5.646L8.718 6.749C6.969 7.846 5.8 9.787 5.8 12C5.8 15.419 8.581 18.2 12 18.2C15.419 18.2 18.2 15.419 18.2 12C18.2 9.787 17.031 7.846 15.281 6.749L15.971 5.646C18.088 6.971 19.5 9.318 19.5 12C19.5 16.142 16.142 19.5 12 19.5Z"/>
    </svg>
  );
};

Logout.displayName = 'Logout';

export default Logout;
