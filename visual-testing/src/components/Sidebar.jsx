import React from 'react';
import SearchFilter from './SearchFilter';
import SizeControls from './SizeControls';
import ColorControls from './ColorControls';
import ExportTools from './ExportTools';
import '../styles/components.css';

/**
 * Sidebar Component
 * 
 * Contains all the control panels and filters for the visual testing interface
 */
function Sidebar({ 
  icons,
  filterCriteria,
  onFilterChange,
  iconSize,
  onSizeChange,
  colorTheme,
  onThemeChange,
  selectedIcons,
  onClearSelections,
  onSelectAllVisible
}) {

  // Helper function to filter icons based on criteria
  const getVisibleIconsCount = () => {
    if (!icons || icons.length === 0) return 0;
    
    return icons.filter(icon => {
      if (filterCriteria.search) {
        const searchTerm = filterCriteria.search.toLowerCase();
        return icon.name.toLowerCase().includes(searchTerm) ||
               icon.category.toLowerCase().includes(searchTerm) ||
               (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
      }
      if (filterCriteria.category && filterCriteria.category !== 'all') {
        return icon.category === filterCriteria.category;
      }
      return true;
    }).length;
  };

  const visibleIconsCount = getVisibleIconsCount();

  return (
    <aside className="sidebar">
      {/* Sidebar Content */}
      <div className="sidebar__content">
          {/* Search and Filter Section */}
          <section className="sidebar__section">
            <SearchFilter 
              icons={icons}
              onFilter={onFilterChange}
            />
          </section>

          {/* Size Controls Section */}
          <section className="sidebar__section sidebar__section--compact">
            <SizeControls 
              currentSize={iconSize}
              onSizeChange={onSizeChange}
            />
          </section>

          {/* Color Controls Section */}
          <section className="sidebar__section sidebar__section--compact">
            <ColorControls 
              currentTheme={colorTheme}
              onThemeChange={onThemeChange}
            />
          </section>

          {/* Selection Controls Section */}
          <section className="sidebar__section sidebar__section--compact">
            <div className="sidebar__selection-controls">
              {selectedIcons.length > 0 ? (
                <div className="sidebar__selection-active">
                  <p className="sidebar__selection-info">
                    {selectedIcons.length} icon{selectedIcons.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="sidebar__selection-actions">
                    <button
                      onClick={onSelectAllVisible}
                      className="sidebar__btn sidebar__btn--secondary"
                    >
                      Select All Visible
                    </button>
                    <button
                      onClick={onClearSelections}
                      className="sidebar__btn sidebar__btn--danger"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sidebar__selection-empty">
                  <p className="sidebar__selection-hint">
                    Click on icons to select them
                  </p>
                  <button
                    onClick={onSelectAllVisible}
                    className="sidebar__btn sidebar__btn--primary"
                  >
                    Select All Visible
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Export Tools Section */}
          {selectedIcons.length > 0 && (
            <section className="sidebar__section sidebar__section--compact">
              <ExportTools 
                selectedIcons={selectedIcons}
                iconSize={iconSize}
                colorTheme={colorTheme}
              />
            </section>
          )}
        </div>
    </aside>
  );
}

export default Sidebar;
