import React from 'react';

const TradeIn = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM17 17H11V19L6.199 16L11 13V15H17V17ZM13 11V9H7V7H13V5L17.801 8L13 11Z"/>
    </svg>
  );
};

TradeIn.displayName = 'TradeIn';

export default TradeIn;
