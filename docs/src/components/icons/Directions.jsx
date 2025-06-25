import React from 'react';

const Directions = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M22 1H2C1.448 1 1 1.448 1 2V22C1 22.552 1.448 23 2 23H22C22.552 23 23 22.552 23 22V2C23 1.448 22.552 1 22 1ZM18 20H15V17C15 16.448 14.552 16 14 16H9C7.343 16 6 14.657 6 13V9H4L7.5 3.399L11 9H9V12C9 12.552 9.448 13 10 13H15C16.657 13 18 14.343 18 16V20Z"/>
    </svg>
  );
};

Directions.displayName = 'Directions';

export default Directions;
