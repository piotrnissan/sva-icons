import React from 'react';

const Calendar = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M22 6V3H20.5C20.224 3 20 2.776 20 2.5V2C20 1.448 19.552 1 19 1C18.448 1 18 1.448 18 2V2.5C18 2.776 17.776 3 17.5 3H6.5C6.224 3 6 2.776 6 2.5V2C6 1.448 5.552 1 5 1C4.448 1 4 1.448 4 2V2.5C4 2.776 3.776 3 3.5 3H2V6H22ZM7.75 14.5C8.7165 14.5 9.5 13.7165 9.5 12.75C9.5 11.7835 8.7165 11 7.75 11C6.7835 11 6 11.7835 6 12.75C6 13.7165 6.7835 14.5 7.75 14.5ZM2 20V7H22V20C22 21.657 20.657 23 19 23H5C3.343 23 2 21.657 2 20ZM5 12.75C5 14.269 6.231 15.5 7.75 15.5C9.269 15.5 10.5 14.269 10.5 12.75C10.5 11.231 9.269 10 7.75 10C6.231 10 5 11.231 5 12.75Z"/>
    </svg>
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
