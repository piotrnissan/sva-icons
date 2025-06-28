import React from 'react';

const BurgerMenu = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 6C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H3ZM2 12C2 12.5523 2.44772 13 3 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H3C2.44772 11 2 11.4477 2 12ZM2 19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19C22 18.4477 21.5523 18 21 18H3C2.44772 18 2 18.4477 2 19Z"/>
    </svg>
  );
};

BurgerMenu.displayName = 'BurgerMenu';

export default BurgerMenu;
