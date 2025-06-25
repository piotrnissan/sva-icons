import React from 'react';

const Yen = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 11.998 23 11.996 23 11.994C23 5.922 18.078 1 12.006 1C12.004 1 12.002 1 11.999 1H12ZM16 11V13H13V14H16V16H13V20H11V16H8V14H11V13H8V11H10.58L6.29 6.71L7.71 5.29L12 9.58L16.29 5.29L17.71 6.71L13.42 11H16Z"/>
    </svg>
  );
};

Yen.displayName = 'Yen';

export default Yen;
