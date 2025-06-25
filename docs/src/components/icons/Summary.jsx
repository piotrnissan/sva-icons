import React from 'react';

const Summary = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M21 1H3C2.448 1 2 1.448 2 2V22C2 22.552 2.448 23 3 23H21C21.552 23 22 22.552 22 22V2C22 1.448 21.552 1 21 1ZM8.617 6.066L10.56 8.008L14.91 3.657L15.617 4.364L10.56 9.422L7.91 6.773L8.617 6.066ZM19 19H5V18H19V19ZM19 16H5V15H19V16ZM19 13H5V12H19V13Z"/>
    </svg>
  );
};

Summary.displayName = 'Summary';

export default Summary;
