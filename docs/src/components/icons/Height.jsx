import React from 'react';

const Height = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M22.54 3.658C22.372 2.142 21.084 1 19.56 1H4.441C2.916 1 1.628 2.142 1.46 3.658C1.158 6.381 1.002 9.148 1 11.951V22C1 22.552 1.448 23 2 23H4C4.552 23 5 22.552 5 22V20H19V22C19 22.552 19.448 23 20 23H22C22.552 23 23 22.552 23 22V11.951C22.998 9.148 22.842 6.381 22.54 3.658ZM14.5 14L12 18.001L9.5 14H11V7H9.5L12 2.999L14.5 7H13V14H14.5Z"/>
    </svg>
  );
};

Height.displayName = 'Height';

export default Height;
