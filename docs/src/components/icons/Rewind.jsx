import React from 'react';

const Rewind = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M1.34695 12.094L12.929 19.331C13.3949 19.622 14 19.287 14 18.737V13.751L22.929 19.331C23.395 19.622 24 19.287 24 18.737V4.26302C24 3.71302 23.395 3.37802 22.929 3.66902L14 9.24902V4.26302C14 3.71302 13.3949 3.37802 12.929 3.66902L1.34695 10.906C0.90795 11.181 0.90795 11.819 1.34695 12.094Z"/>
    </svg>
  );
};

Rewind.displayName = 'Rewind';

export default Rewind;
