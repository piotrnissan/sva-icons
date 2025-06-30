import React, { useState, useMemo } from 'react';
import IconCard from './IconCard';
import { filterIcons } from '../utils/categoryUtils';
import '../styles/grid.css';

/**
 * IconGrid Component
 * 
 * Displays a responsive grid of icon cards with filtering and selection
 */
function IconGrid({ icons, filterCriteria, onIconSelect, selectedIcons = [], iconSize = 'm', colorTheme = 'default', viewMode = 'grid' }) {

  // Apply filters and sorting
  const filteredAndSortedIcons = useMemo(() => {
    let result = [...icons];

    // Apply search filter
    if (filterCriteria?.searchTerm) {
      result = filterIcons(result, filterCriteria.searchTerm);
    }

    // Apply category filter
    if (filterCriteria?.category && filterCriteria.category !== 'all') {
      result = result.filter(icon => icon.category === filterCriteria.category);
    }

    // Apply sorting
    if (filterCriteria?.sortBy) {
      switch (filterCriteria.sortBy) {
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'category':
          result.sort((a, b) => {
            const categoryCompare = a.category.localeCompare(b.category);
            return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
          });
          break;
        case 'size':
          result.sort((a, b) => (b.size || 0) - (a.size || 0));
          break;
        default:
          break;
      }
    }

    return result;
  }, [icons, filterCriteria]);

  const handleIconSelect = (icon) => {
    if (onIconSelect) {
      onIconSelect(icon);
    }
  };

  const isIconSelected = (icon) => {
    return selectedIcons.some(selected => selected.name === icon.name);
  };

  const getGridClassName = () => {
    const baseClass = 'icon-grid';
    // Map icon size to grid size
    const gridSizeMap = {
      'xs': 'small',
      's': 'small', 
      'm': 'medium',
      'l': 'large',
      'xl': 'large'
    };
    const gridSize = gridSizeMap[iconSize] || 'medium';
    const sizeClass = `icon-grid--${gridSize}`;
    const viewClass = `icon-grid--${viewMode}`;
    const className = `${baseClass} ${sizeClass} ${viewClass}`;
    
    console.log('🎯 Grid className:', className);
    console.log('🎯 Icon size:', iconSize, '→ Grid size:', gridSize);
    
    return className;
  };

  // Map size values from SizeControls to IconGrid/IconCard format
  const mapSizeToCardSize = (size) => {
    const sizeMap = {
      'xs': 'small',
      's': 'small',
      'm': 'medium',
      'l': 'large',
      'xl': 'large'
    };
    return sizeMap[size] || 'medium';
  };

  return (
    <div className="icon-grid-container">
      {/* Grid Controls */}
      <div className="icon-grid__controls">
        <div className="icon-grid__stats">
          <span className="icon-grid__count">
            {filteredAndSortedIcons.length} of {icons.length} icons
          </span>
          {filterCriteria?.searchTerm && (
            <span className="icon-grid__search-info">
              matching "{filterCriteria.searchTerm}"
            </span>
          )}
        </div>

        <div className="icon-grid__view-controls">
          {/* Size Display - now controlled by SizeControls component */}
          <div className="icon-grid__size-display">
            <span className="icon-grid__control-label">Current Size:</span>
            <span className="icon-grid__current-size">{iconSize.toUpperCase()}</span>
          </div>

          {/* Color Theme Display */}
          <div className="icon-grid__theme-display">
            <span className="icon-grid__control-label">Current Theme:</span>
            <span className="icon-grid__current-theme">{colorTheme}</span>
          </div>

          {/* View Mode Toggle (for future use) */}
          <div className="icon-grid__view-toggle">
            <button
              className={`icon-grid__view-btn ${viewMode === 'grid' ? 'icon-grid__view-btn--active' : ''}`}
              onClick={() => {}} // Will be implemented in future phases
              title="Grid view"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/>
              </svg>
            </button>
            <button
              className={`icon-grid__view-btn ${viewMode === 'list' ? 'icon-grid__view-btn--active' : ''}`}
              onClick={() => {}} // Will be implemented in future phases
              title="List view"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M3,5H21V7H3V5M3,13V11H21V13H3M3,19V17H21V19H3Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {filteredAndSortedIcons.length > 0 ? (
        <div className={getGridClassName()}>
          {filteredAndSortedIcons.map((icon) => (
            <IconCard
              key={icon.name}
              icon={icon}
              onSelect={handleIconSelect}
              isSelected={isIconSelected(icon)}
              size={mapSizeToCardSize(iconSize)}
              iconSize={iconSize}
              colorTheme={colorTheme}
            />
          ))}
        </div>
      ) : (
        <div className="icon-grid__empty">
          <div className="icon-grid__empty-content">
            <svg className="icon-grid__empty-icon" viewBox="0 0 24 24" width="48" height="48">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <h3 className="icon-grid__empty-title">No icons found</h3>
            <p className="icon-grid__empty-message">
              {filterCriteria?.searchTerm 
                ? `No icons match your search for "${filterCriteria.searchTerm}"`
                : 'No icons match your current filters'
              }
            </p>
            <p className="icon-grid__empty-suggestion">
              Try adjusting your search terms or clearing the filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default IconGrid;
