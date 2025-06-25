import React from 'react';

const Alexa = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C22.99 5.929 18.071 1.01 12.001 1H12ZM10.275 22.861V20.68C10.269 19.884 9.783 19.204 9.093 18.913L9.08 18.908C6.365 17.739 4.499 15.087 4.499 11.999C4.499 7.856 7.857 4.498 12 4.498C16.143 4.498 19.501 7.856 19.501 11.999C19.501 16.857 15.743 21.45 10.275 22.861Z"/>
    </svg>
  );
};

Alexa.displayName = 'Alexa';

export default Alexa;
