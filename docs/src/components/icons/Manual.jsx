import React from 'react';

const Manual = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M12.5 0C6.149 0 1 5.149 1 11.5C1 17.851 6.149 23 12.5 23C18.851 23 24 17.851 24 11.5C24 5.149 18.851 0 12.5 0ZM8 16H6.7V13.8H8V16ZM18.3 16H17V12.3H13.15V16H11.85V12.3H8.7C7.596 12.3 6.7 11.405 6.7 10.3V7H8V10C8 10.552 8.448 11 9 11H11.85V7H13.15V11H17V7H18.3V16Z"/>
    </svg>
  );
};

Manual.displayName = 'Manual';

export default Manual;
