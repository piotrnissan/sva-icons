import React from 'react';
import '../styles/components.css';

/**
 * SizeControls Component
 * 
 * Provides controls for testing icons at different sizes
 */
function SizeControls({ currentSize, onSizeChange }) {
  const sizes = [
    { value: 'xs', label: 'XS', description: '16px' },
    { value: 's', label: 'S', description: '20px' },
    { value: 'm', label: 'M', description: '24px' },
    { value: 'l', label: 'L', description: '32px' },
    { value: 'xl', label: 'XL', description: '48px' }
  ];

  return (
    <div className="size-controls">
      <h3 className="size-controls__title">Size</h3>
      
      <div className="size-controls__options">
        {sizes.map(size => (
          <button
            key={size.value}
            className={`size-controls__option ${currentSize === size.value ? 'size-controls__option--active' : ''}`}
            onClick={() => onSizeChange(size.value)}
            title={`${size.label} - ${size.description}`}
          >
            <span className="size-controls__size-label">{size.label}</span>
            <span className="size-controls__size-value">{size.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeControls;
