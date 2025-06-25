import React from 'react';

const Reports = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M16 5V1H3C2.448 1 2 1.448 2 2V22C2 22.552 2.448 23 3 23H21C21.552 23 22 22.552 22 22V7H18C16.897 7 16 6.103 16 5ZM7 20H5V12C5 11.448 5.448 11 6 11C6.552 11 7 11.448 7 12V20ZM11 20H9V8C9 7.448 9.448 7 10 7C10.552 7 11 7.448 11 8V20ZM15 20H13V12C13 11.448 13.448 11 14 11C14.552 11 15 11.448 15 12V20ZM19 20H17V16C17 15.448 17.448 15 18 15C18.552 15 19 15.448 19 16V20ZM18 6H22L17 1V5C17 5.552 17.448 6 18 6Z"/>
    </svg>
  );
};

Reports.displayName = 'Reports';

export default Reports;
