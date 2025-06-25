import React from 'react';

const Choice = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM5.45707 14.112L9.15807 17.812L17.5641 9.40596C17.9541 9.01596 17.9541 8.38196 17.5641 7.99196C17.1741 7.60196 16.5401 7.60196 16.1501 7.99196L9.15807 14.984L6.87107 12.698C6.48007 12.308 5.84707 12.308 5.45707 12.698C5.06607 13.088 5.06607 13.722 5.45707 14.112Z"/>
    </svg>
  );
};

Choice.displayName = 'Choice';

export default Choice;
