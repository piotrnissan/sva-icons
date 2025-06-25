import React from 'react';

const Info = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM12 21C7.037 21 3 16.963 3 12C3 7.037 7.037 3 12 3C16.963 3 21 7.037 21 12C21 16.963 16.962 21 12 21ZM11 10.5V18.5H13V10.5H11ZM13.25 6.75C13.25 7.44036 12.6904 8 12 8C11.3096 8 10.75 7.44036 10.75 6.75C10.75 6.05964 11.3096 5.5 12 5.5C12.6904 5.5 13.25 6.05964 13.25 6.75Z"/>
    </svg>
  );
};

Info.displayName = 'Info';

export default Info;
