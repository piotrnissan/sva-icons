import React from 'react';

const DeviceCompatibility = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0H18C19.1 0 20 0.9 20 2V21C20 22.1 19.1 23 18 23H6C4.9 23 4 22.1 4 21V2C4 0.9 4.9 0 6 0ZM6 21H18V2H6V21ZM6.95898 2.95898H17.04V20.04H6.95898V2.95898ZM11 18C11 18.552 11.448 19 12 19C12.552 19 13 18.552 13 18C13 17.448 12.552 17 12 17C11.448 17 11 17.448 11 18ZM8.11698 10.751L10.749 13.384L15.661 8.47198L14.742 7.55298L10.749 11.545L9.03598 9.83198L8.11698 10.751Z"/>
    </svg>
  );
};

DeviceCompatibility.displayName = 'DeviceCompatibility';

export default DeviceCompatibility;
