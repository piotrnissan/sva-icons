import React from 'react';

const InstallUpdate = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M8.293 14.207C8.109 14.026 7.996 13.774 7.996 13.496C7.996 12.944 8.444 12.496 8.996 12.496C9.274 12.496 9.526 12.61 9.707 12.793L11 14.086V2H13V14.086L14.293 12.793C14.474 12.612 14.724 12.5 15 12.5C15.552 12.5 16 12.948 16 13.5C16 13.776 15.888 14.026 15.707 14.207L12 17.914L8.293 14.207ZM5 20V22H19V20H5Z"/>
    </svg>
  );
};

InstallUpdate.displayName = 'InstallUpdate';

export default InstallUpdate;
