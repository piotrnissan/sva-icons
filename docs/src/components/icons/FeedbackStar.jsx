import React from 'react';

const FeedbackStar = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M22.5579 8.00002H15.4719L12.9419 0.918022C12.6259 0.0330225 11.3749 0.0330225 11.0589 0.918022L8.52785 8.00002H1.44186C0.493855 8.00002 0.0778552 9.19502 0.820855 9.78402L6.38086 14.189L4.39586 21.19C4.14286 22.082 5.13385 22.808 5.90786 22.298L11.9999 18.285L18.0919 22.297C18.8659 22.807 19.8569 22.081 19.6039 21.189L17.6189 14.188L23.1789 9.78302C23.9219 9.19502 23.5059 8.00002 22.5579 8.00002Z"/>
    </svg>
  );
};

FeedbackStar.displayName = 'FeedbackStar';

export default FeedbackStar;
