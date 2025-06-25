import React from 'react';

const LiveChat = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M19 3V8C19 9.1 18.1 10 17 10H3.357L0.883 12.947C0.583 13.305 0 13.093 0 12.626V3C0 1.9 0.9 1 2 1H17C18.1 1 19 1.9 19 3ZM4 6H15V5H4V6ZM7 12H21C22.1 12 23 12.9 23 14V22.627C23 23.093 22.417 23.306 22.117 22.948L19.644 20H7C5.9 20 5 19.1 5 18V14C5 12.9 5.9 12 7 12ZM9 16C9 16.552 9.448 17 10 17C10.552 17 11 16.552 11 16C11 15.448 10.552 15 10 15C9.448 15 9 15.448 9 16ZM13 16C13 16.552 13.448 17 14 17C14.552 17 15 16.552 15 16C15 15.448 14.552 15 14 15C13.448 15 13 15.448 13 16ZM17 16C17 16.552 17.448 17 18 17C18.552 17 19 16.552 19 16C19 15.448 18.552 15 18 15C17.448 15 17 15.448 17 16Z"/>
    </svg>
  );
};

LiveChat.displayName = 'LiveChat';

export default LiveChat;
