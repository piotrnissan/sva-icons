import React from 'react';

const Pause = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M8.3 2H4.7C4.315 2 4 2.315 4 2.7V21.3C4 21.685 4.315 22 4.7 22H8.3C8.685 22 9 21.685 9 21.3V2.7C9 2.315 8.685 2 8.3 2ZM19.3 2H15.7C15.315 2 15 2.315 15 2.7V21.3C15 21.685 15.315 22 15.7 22H19.3C19.685 22 20 21.685 20 21.3V2.7C20 2.315 19.685 2 19.3 2Z"/>
    </svg>
  );
};

Pause.displayName = 'Pause';

export default Pause;
