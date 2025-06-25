import React from 'react';

const PreferredDealerSolid = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M21.721 3.79301C20.575 2.49801 18.966 1.76001 17.19 1.71501L17.014 1.71301C15.054 1.71301 13.294 2.55601 12.001 4.05101C10.708 2.55601 8.94797 1.71301 6.98797 1.71301L6.81097 1.71501C5.03397 1.76001 3.42497 2.49801 2.27897 3.79301C0.940967 5.30601 0.323967 7.41301 0.541967 9.72801C0.590967 10.461 1.35797 18.523 11.489 22.197L12 22.383L12.511 22.197C22.641 18.523 23.408 10.46 23.457 9.72801C23.676 7.41301 23.059 5.30601 21.721 3.79301Z"/>
    </svg>
  );
};

PreferredDealerSolid.displayName = 'PreferredDealerSolid';

export default PreferredDealerSolid;
