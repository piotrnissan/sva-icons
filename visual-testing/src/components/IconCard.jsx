import React, { useState } from 'react';
import '../styles/components.css';

/**
 * IconCard Component
 * 
 * Displays an individual icon with hover states and click functionality
 */
function IconCard({ icon, onSelect, isSelected = false, size = 'medium', iconSize = 'm', colorTheme = 'default' }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(icon);
    }
  };

  const handleCopyName = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(icon.name);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy icon name:', err);
    }
  };

  const handleCopyClass = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`sva-icon-${icon.name}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy class name:', err);
    }
  };

  const getThemeColors = (theme) => {
    const colorMap = {
      'default': { color: '#333', backgroundColor: 'transparent' },
      'primary': { color: '#007acc', backgroundColor: 'transparent' },
      'secondary': { color: '#6c757d', backgroundColor: 'transparent' },
      'success': { color: '#28a745', backgroundColor: 'transparent' },
      'warning': { color: '#ffc107', backgroundColor: 'transparent' },
      'error': { color: '#dc3545', backgroundColor: 'transparent' },
      'inverted': { color: '#ffffff', backgroundColor: '#333' },
      'light-gray': { color: '#9e9e9e', backgroundColor: 'transparent' }
    };
    return colorMap[theme] || colorMap['default'];
  };

  const themeColors = getThemeColors(colorTheme);

  return (
    <div 
      className={`icon-card ${isSelected ? 'icon-card--selected' : ''} icon-card--${size} icon-card--size-${iconSize} icon-card--theme-${colorTheme}`}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        '--icon-color': themeColors.color,
        '--icon-bg': themeColors.backgroundColor
      }}
    >
      {/* Icon Display */}
      <div 
        className={`icon-card__icon icon-card__icon--${iconSize}`}
        style={{
          color: themeColors.color,
          backgroundColor: themeColors.backgroundColor
        }}
      >
        <div 
          className={`icon-card__svg icon-card__svg--${iconSize}`}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      </div>

      {/* Icon Name */}
      <div className="icon-card__name">
        {icon.name}
      </div>

      {/* Category Badge */}
      <div className="icon-card__category">
        {icon.category}
      </div>

      {/* Action Buttons (shown on hover) */}
      <div className="icon-card__actions">
        <button
          className="icon-card__action-btn"
          onClick={handleCopyName}
          title="Copy icon name"
          aria-label={`Copy icon name: ${icon.name}`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
          </svg>
        </button>
        
        <button
          className="icon-card__action-btn"
          onClick={handleCopyClass}
          title="Copy CSS class"
          aria-label={`Copy CSS class: sva-icon-${icon.name}`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
          </svg>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="icon-card__tooltip">
          <div className="icon-card__tooltip-content">
            <strong>{icon.name}</strong>
            <br />
            Category: {icon.category}
            <br />
            Class: sva-icon-{icon.name}
            {icon.tags && icon.tags.length > 0 && (
              <>
                <br />
                Tags: {icon.tags.slice(0, 3).join(', ')}
                {icon.tags.length > 3 && '...'}
              </>
            )}
          </div>
        </div>
      )}

      {/* Copy Success Indicator */}
      {copySuccess && (
        <div className="icon-card__copy-success">
          Copied!
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="icon-card__selection-indicator">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      )}
    </div>
  );
}

export default IconCard;
