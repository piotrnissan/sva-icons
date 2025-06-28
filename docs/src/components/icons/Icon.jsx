import React from 'react';
import * as Icons from './index.js';

/**
 * Enhanced SVA Icons v2.0 Icon Component
 * Supports theme-aware rendering, size presets, and smart bundles
 */

// Size mappings
const SIZES = {
  xs: 12,
  sm: 16,
  md: 20, // SVA default
  lg: 24,
  xl: 32,
  xxl: 48
};

// Theme class mappings
const THEME_CLASSES = {
  automotive: 'sva-icon--automotive',
  ui: 'sva-icon--ui',
  status: 'sva-icon--status',
  controls: 'sva-icon--controls',
  navigation: 'sva-icon--navigation'
};

/**
 * Enhanced Icon component with v2.0 features
 */
const Icon = ({ 
  name, 
  size = 'md', 
  variant = 'outline',
  themeAware = false,
  bundle,
  color = 'currentColor',
  className = '',
  'aria-label': ariaLabel,
  ...props 
}) => {
  // Convert name to PascalCase for component lookup
  const componentName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  const IconComponent = Icons[componentName];
  
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`SVA Icons: Icon "${name}" not found. Available icons:`, Object.keys(Icons).slice(0, 10));
    }
    return null;
  }

  // Calculate size
  const iconSize = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  
  // Build className
  const classes = [
    'sva-icon',
    themeAware && 'sva-icon--theme-aware',
    variant && `sva-icon--${variant}`,
    bundle && THEME_CLASSES[bundle],
    className
  ].filter(Boolean).join(' ');

  return (
    <IconComponent
      size={iconSize}
      color={color}
      className={classes}
      aria-label={ariaLabel || `${name} icon`}
      {...props}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
