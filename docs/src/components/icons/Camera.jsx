import React from 'react';

const Camera = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <g clip-path="url(#clip0_783_917)"><path d="M24 18L18 14.943V16.102C18 17.703 16.702 19 15.102 19H2.898C1.297 19 0 17.702 0 16.102V7.89898C0 6.29798 1.298 5.00098 2.898 5.00098H15.102C16.703 5.00098 18 6.29898 18 7.89898V9.05798L24 6.00098V18Z"/></g>
    </svg>
  );
};

Camera.displayName = 'Camera';

export default Camera;
