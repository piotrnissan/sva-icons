import React from 'react';

const ListBullet = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M13.2428 14.224V11.872H10.7628V14.224H13.2428Z"/>
    </svg>
  );
};

ListBullet.displayName = 'ListBullet';

export default ListBullet;
