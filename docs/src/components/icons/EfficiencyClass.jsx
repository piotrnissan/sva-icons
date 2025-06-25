import React from 'react';

const EfficiencyClass = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M2 7H8.199L13 4L8.199 1H2C1.448 1 1 1.448 1 2V6C1 6.552 1.448 7 2 7ZM2 15H14.199L19 12L14.199 9H2C1.448 9 1 9.448 1 10V14C1 14.552 1.448 15 2 15ZM18.199 17H2C1.448 17 1 17.448 1 18V22C1 22.552 1.448 23 2 23H18.199L23 20L18.199 17Z"/>
    </svg>
  );
};

EfficiencyClass.displayName = 'EfficiencyClass';

export default EfficiencyClass;
