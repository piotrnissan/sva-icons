import React from 'react';

const FuelPricesJpy = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M15.57 19.06V17.67H12.89V16.87H15.57V15.43H14C14.577 14.652 15.159 13.76 15.689 12.835L15.76 12.7H13.6C13.084 13.788 12.544 14.712 11.937 15.586L11.98 15.52C11.401 14.709 10.852 13.785 10.381 12.815L10.33 12.7H8.24C8.777 13.743 9.348 14.637 9.991 15.472L9.96 15.43H8.42V16.87H11.07V17.67H8.42V19.06H11.07V20.5H12.89V19.06H15.57ZM12 0C12 0 19 12 19 17C19 20.866 15.866 24 12 24C8.134 24 5 20.866 5 17C5 12 12 0 12 0Z"/>
    </svg>
  );
};

FuelPricesJpy.displayName = 'FuelPricesJpy';

export default FuelPricesJpy;
