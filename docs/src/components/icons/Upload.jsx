import React from 'react';

const Upload = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M15.703 4.707C15.887 4.888 16 5.14 16 5.418C16 5.97 15.552 6.418 15 6.418C14.722 6.418 14.47 6.304 14.289 6.121L12.996 4.828L12.996 16.914H10.996L10.996 4.828L9.703 6.121C9.522 6.302 9.272 6.414 8.996 6.414C8.444 6.414 7.996 5.966 7.996 5.414C7.996 5.138 8.108 4.888 8.289 4.707L11.996 1L15.703 4.707Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 17C3.55228 17 4 17.4477 4 18V21H20V18C20 17.4477 20.4477 17 21 17C21.5523 17 22 17.4477 22 18V23H2V18C2 17.4477 2.44772 17 3 17Z"/>
    </svg>
  );
};

Upload.displayName = 'Upload';

export default Upload;
