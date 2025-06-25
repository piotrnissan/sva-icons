import React from 'react';

const FullScreen = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8281 10.586L13.4141 9.172L18.5911 3.995H14.0001V2H22.0001V10H20.0051V5.409L14.8281 10.586ZM9.172 13.4139L10.586 14.8279L5.409 20.0049H10V21.9999H2V13.9999H3.995V18.5909L9.172 13.4139Z"/>
    </svg>
  );
};

FullScreen.displayName = 'FullScreen';

export default FullScreen;
