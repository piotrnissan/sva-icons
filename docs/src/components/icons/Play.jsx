import React from 'react';

const Play = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M19.7219 12.5001C20.1979 12.2251 20.1979 11.7751 19.7219 11.5001L4.99991 3.00006C4.52391 2.72506 4.13391 2.95006 4.13391 3.50006V20.5001C4.13391 21.0501 4.52391 21.2751 4.99991 21.0001L19.7219 12.5001Z"/>
    </svg>
  );
};

Play.displayName = 'Play';

export default Play;
