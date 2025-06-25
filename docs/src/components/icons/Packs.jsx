import React from 'react';

const Packs = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M9 3H2C1.45 3 1 3.45 1 4V11C1 11.55 1.45 12 2 12H9C9.55 12 10 11.55 10 11V4C10 3.45 9.55 3 9 3Z"/><path d="M20 14H13C12.45 14 12 14.45 12 15V22C12 22.55 12.45 23 13 23H20C20.55 23 21 22.55 21 22V15C21 14.45 20.55 14 20 14Z"/><path d="M9 14H2C1.45 14 1 14.45 1 15V22C1 22.55 1.45 23 2 23H9C9.55 23 10 22.55 10 22V15C10 14.45 9.55 14 9 14Z"/><path d="M17.5 0C13.91 0 11 2.91 11 6.5C11 10.09 13.91 13 17.5 13C21.09 13 24 10.09 24 6.5C24 2.91 21.09 0 17.5 0ZM21 7H18V10H17V7H14V6H17V3H18V6H21V7Z"/>
    </svg>
  );
};

Packs.displayName = 'Packs';

export default Packs;
