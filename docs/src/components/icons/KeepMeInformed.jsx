import React from 'react';

const KeepMeInformed = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M8 8H1C0.448 8 0 8.448 0 9V22C0 22.552 0.448 23 1 23H8C8.552 23 9 22.552 9 22V9C9 8.448 8.552 8 8 8ZM8 15.5C8 15.775 7.775 16 7.5 16H1.5C1.225 16 1 15.775 1 15.5V13.5C1 13.225 1.225 13 1.5 13H7.5C7.775 13 8 13.225 8 13.5V15.5ZM10 19H11.3L10.673 20.93C10.673 20.93 10.54 21.361 10 21.5V22C10 22.366 9.894 22.705 9.722 23H19V22.5C19 21.948 18.552 21.5 18 21.5H17.239C16.806 21.5 16.422 21.221 16.288 20.809L15.7 19H23C23.55 19 24 18.55 24 18V16H10V19ZM23 2H4C3.45 2 3 2.45 3 3V7H8C9.103 7 10 7.897 10 9V15H24V3C24 2.45 23.55 2 23 2ZM22 7.5C22 7.775 21.775 8 21.5 8H15.5C15.225 8 15 7.775 15 7.5V5.5C15 5.225 15.225 5 15.5 5H21.5C21.775 5 22 5.225 22 5.5V7.5Z"/>
    </svg>
  );
};

KeepMeInformed.displayName = 'KeepMeInformed';

export default KeepMeInformed;
