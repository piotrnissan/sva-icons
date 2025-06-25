import React from 'react';

const Edit = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      {...props}
    >
      <path d="M1.66992 24.0001L7.62492 21.0961L3.49692 17.6321L1.66992 24.0001ZM21.8489 2.04714L19.7849 0.315142C19.2149 -0.162858 18.3649 -0.0888578 17.8869 0.481142L16.3249 2.34314L20.4529 5.80714L22.0149 3.94514C22.4929 3.37514 22.4189 2.52614 21.8489 2.04714ZM4.13892 16.8651L8.26692 20.3291L19.8099 6.57314L15.6819 3.10914L4.13892 16.8651Z"/>
    </svg>
  );
};

Edit.displayName = 'Edit';

export default Edit;
