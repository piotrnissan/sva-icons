import React from 'react';

const RedCross = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM10 4H14V10H20V14H14V20H10V14H4V10H10V4Z"/>
    </svg>
  );
};

RedCross.displayName = 'RedCross';

export default RedCross;
