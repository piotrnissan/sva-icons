import React from 'react';

const ArrowRight = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M6.99596 22.998C6.48493 22.998 5.9749 22.8034 5.58464 22.4132C4.80512 21.6336 4.80512 20.37 5.58464 19.5905L13.1772 11.9979L5.58464 4.40533C4.80512 3.62581 4.80512 2.36221 5.58464 1.58269C6.36316 0.803167 7.62876 0.803167 8.40728 1.58269L18.8225 11.9979L8.40728 22.4142C8.01802 22.8034 7.50699 22.998 6.99596 22.998Z"/>
    </svg>
  );
};

ArrowRight.displayName = 'ArrowRight';

export default ArrowRight;
