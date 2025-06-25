import React from 'react';

const SocialFacebook = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M12 1C5.925 1 1 5.925 1 12C1 17.49 5.023 22.041 10.281 22.866V15.18H7.488V12H10.281V9.577C10.281 6.82 11.923 5.297 14.436 5.297C15.64 5.297 16.898 5.512 16.898 5.512V8.219H15.511C14.145 8.219 13.718 9.067 13.718 9.937V12H16.769L16.281 15.18H13.718V22.867C18.977 22.041 23 17.49 23 12C23 5.925 18.075 1 12 1Z"/>
    </svg>
  );
};

SocialFacebook.displayName = 'SocialFacebook';

export default SocialFacebook;
