import React from 'react';
import '../styles/components.css';

/**
 * ColorControls Component
 * 
 * Provides controls for testing icons with different color themes
 */
function ColorControls({ currentTheme, onThemeChange }) {
  const themes = [
    { 
      value: 'default', 
      label: 'Default', 
      description: 'Original colors',
      color: '#333'
    },
    { 
      value: 'primary', 
      label: 'Primary', 
      description: 'Brand blue',
      color: '#007acc'
    },
    { 
      value: 'secondary', 
      label: 'Secondary', 
      description: 'Accent color',
      color: '#6c757d'
    },
    { 
      value: 'success', 
      label: 'Success', 
      description: 'Green theme',
      color: '#28a745'
    },
    { 
      value: 'warning', 
      label: 'Warning', 
      description: 'Orange theme',
      color: '#ffc107'
    },
    { 
      value: 'error', 
      label: 'Error', 
      description: 'Red theme',
      color: '#dc3545'
    },
    { 
      value: 'inverted', 
      label: 'Inverted', 
      description: 'White on dark',
      color: '#ffffff',
      backgroundColor: '#333'
    },
    { 
      value: 'light-gray', 
      label: 'Light Gray', 
      description: 'Subtle gray',
      color: '#9e9e9e'
    }
  ];

  return (
    <div className="color-controls">
      <h3 className="color-controls__title">Color</h3>
      
      <div className="color-controls__options">
        {themes.map(theme => (
          <button
            key={theme.value}
            className={`color-controls__option ${currentTheme === theme.value ? 'color-controls__option--active' : ''}`}
            onClick={() => onThemeChange(theme.value)}
            title={`${theme.label} - ${theme.description}`}
          >
            <div 
              className="color-controls__option-preview"
              style={{
                color: theme.color,
                backgroundColor: theme.backgroundColor || 'transparent'
              }}
            >
              {/* Sample icon SVG */}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="color-controls__option-label">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ColorControls;
