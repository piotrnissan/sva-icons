import React from 'react';

const Tick = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M8.01908 20.8027L1.59187 14.4394C0.808066 13.6645 0.802076 12.3995 1.57789 11.6157C2.35371 10.8319 3.61779 10.8259 4.40259 11.6017L8.0051 15.1693L19.5914 3.58291C20.3713 2.80309 21.6353 2.80309 22.4151 3.58291C23.195 4.36272 23.195 5.62679 22.4151 6.4066L8.01908 20.8027Z"/>
    </svg>
  );
};

Tick.displayName = 'Tick';

export default Tick;
