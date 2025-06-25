import React from 'react';

const Registration = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M21 1H19V9.5L17.5 8L16 9.5V1H3C2.448 1 2 1.448 2 2V22C2 22.552 2.448 23 3 23H21C21.552 23 22 22.552 22 22V2C22 1.448 21.552 1 21 1ZM5 6H14V7H5V6ZM5 10H14V11H5V10ZM19 19H5V18H19V19ZM19 15H5V14H19V15Z"/>
    </svg>
  );
};

Registration.displayName = 'Registration';

export default Registration;
