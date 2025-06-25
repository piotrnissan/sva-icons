import React from 'react';

const NewFeature = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M23 12C23 18.075 18.075 23 12 23C5.925 23 1 18.075 1 12C1 5.925 5.925 1 12 1C12.002 1 12.004 1 12.006 1C18.078 1 23 5.922 23 11.994C23 11.996 23 11.998 23 12.001V12ZM14.74 19.76L15.21 16.07L18.93 16.24L16.92 13.11L19.88 10.85L16.33 9.74L17.14 6.11L13.71 7.54L12 4.24L10.29 7.54L6.86 6.11L7.67 9.74L4.12 10.85L7.08 13.11L5.07 16.24L8.79 16.07L9.26 19.76L12 17.24L14.74 19.76Z"/>
    </svg>
  );
};

NewFeature.displayName = 'NewFeature';

export default NewFeature;
