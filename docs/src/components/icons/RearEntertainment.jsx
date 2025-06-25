import React from 'react';

const RearEntertainment = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M22.264 2.764C18.902 2.343 15.476 2.125 12 2.125C8.523 2.125 5.098 2.343 1.736 2.764C0.74 2.888 0 3.75 0 4.753V21C0 22.105 0.895 23 2 23H22C23.104 23 24 22.105 24 21V4.753C24 3.75 23.26 2.888 22.264 2.764ZM22 20C22 20.55 21.55 21 21 21H3C2.45 21 2 20.55 2 20V6C2 5.45 2.45 5 3 5H21C21.55 5 22 5.45 22 6V20ZM3 20H21V6H3V20ZM6.435 13.427L7.23 14.7L15.71 9.4L14.915 8.128H19.633L17.565 12.368L16.77 11.096L8.29 16.395L9.085 17.667H4.367L6.435 13.427Z"/>
    </svg>
  );
};

RearEntertainment.displayName = 'RearEntertainment';

export default RearEntertainment;
