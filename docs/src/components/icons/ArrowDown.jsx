import React from 'react';

const ArrowDown = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M0.911377 7.08275C0.911377 6.57172 1.10601 6.06169 1.49627 5.67143C2.27579 4.89191 3.53939 4.89191 4.31891 5.67143L11.9115 13.264L19.5041 5.67143C20.2836 4.89191 21.5472 4.89191 22.3267 5.67143C23.1063 6.44996 23.1063 7.71555 22.3267 8.49408L11.9115 18.9093L1.49527 8.49408C1.10601 8.10482 0.911377 7.59378 0.911377 7.08275Z"/>
    </svg>
  );
};

ArrowDown.displayName = 'ArrowDown';

export default ArrowDown;
