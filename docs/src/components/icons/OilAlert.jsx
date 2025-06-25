import React from 'react';

const OilAlert = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M11 17.5V19.5H13V17.5H11ZM13 16.5L13.13 10.5H10.88L11 16.5H13ZM19 17C19 20.866 15.866 24 12 24C8.134 24 5 20.866 5 17C5 12 12 0 12 0C12 0 19 12 19 17Z"/>
    </svg>
  );
};

OilAlert.displayName = 'OilAlert';

export default OilAlert;
