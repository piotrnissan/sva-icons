import React from 'react';

const Payment = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M24 8H0V5C0 4.172 0.672 3.5 1.5 3.5H22.5C23.328 3.5 24 4.172 24 5V8ZM24 19V11H0V19C0 19.828 0.672 20.5 1.5 20.5H22.5C23.328 20.5 24 19.828 24 19Z"/>
    </svg>
  );
};

Payment.displayName = 'Payment';

export default Payment;
