import React from 'react';

const Lock = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M20.104 10H18V7C18 3.686 15.314 1 12 1C8.686 1 6 3.686 6 7V10H3.896C3.401 10 3 10.401 3 10.896V22.103C3 22.598 3.401 22.999 3.896 22.999H20.103C20.598 22.999 20.999 22.598 20.999 22.103V10.896C20.999 10.401 20.598 10 20.103 10H20.104ZM8 7C8 4.791 9.791 3 12 3C14.209 3 16 4.791 16 7V10H8V7Z"/>
    </svg>
  );
};

Lock.displayName = 'Lock';

export default Lock;
