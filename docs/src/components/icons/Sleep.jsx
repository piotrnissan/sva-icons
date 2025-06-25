import React from 'react';

const Sleep = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M23 16.377C21.106 20.324 17.142 23 12.552 23C6.172 23 1 17.828 1 11.448C1 6.858 3.676 2.894 7.554 1.03L7.623 1C7.085 2.303 6.773 3.817 6.773 5.403C6.773 11.928 12.058 17.218 18.58 17.227H18.581C18.583 17.227 18.586 17.227 18.588 17.227C20.177 17.227 21.694 16.915 23.079 16.348L23 16.377Z"/>
    </svg>
  );
};

Sleep.displayName = 'Sleep';

export default Sleep;
