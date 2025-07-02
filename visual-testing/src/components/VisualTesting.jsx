import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import IconGrid from './IconGrid';
import APITestingContainer from './APITesting/APITestingContainer';
import DocumentationContainer from './Documentation/DocumentationContainer';
import { loadIconData, watchForNewIcons } from '../utils/iconLoader';
import '../styles/components.css';
import '../styles/documentation.css';
import '../styles/code-example.css';

/**
 * VisualTesting Component
 * 
 * Main container component that orchestrates the visual testing interface
 */
function VisualTesting() {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [iconSize, setIconSize] = useState('m'); // Default to medium size
  const [colorTheme, setColorTheme] = useState('default'); // Default color theme
  const [activeSection, setActiveSection] = useState('documentation'); // Start with documentation

  // Load icons data on component mount
  useEffect(() => {
    const loadIcons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading icon data for visual testing...');
        const iconRegistry = await loadIconData();
        
        // Store data source information
        if (iconRegistry.length > 0) {
          setDataSource(iconRegistry[0].source || 'unknown');
          setLastUpdated(new Date().toISOString());
        }
        
        setIcons(iconRegistry);
        console.log(`✅ Loaded ${iconRegistry.length} icons for visual testing`);
        
      } catch (err) {
        console.error('❌ Failed to load icons:', err);
        setError(`Failed to load icons: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadIcons();

    // Set up icon watcher for live updates
    const stopWatching = watchForNewIcons((updatedIcons) => {
      console.log('🔄 Icon data updated, refreshing...');
      setIcons(updatedIcons);
      setLastUpdated(new Date().toISOString());
    });

    // Cleanup watcher on unmount
    return () => {
      if (stopWatching) stopWatching();
    };
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilterCriteria) => {
    setFilterCriteria(newFilterCriteria);
  }, []);

  // Handle icon selection
  const handleIconSelect = useCallback((icon) => {
    setSelectedIcons(prev => {
      const isAlreadySelected = prev.some(selected => selected.name === icon.name);
      
      if (isAlreadySelected) {
        // Remove from selection
        return prev.filter(selected => selected.name !== icon.name);
      } else {
        // Add to selection
        return [...prev, icon];
      }
    });
  }, []);

  // Handle icon size change
  const handleSizeChange = useCallback((newSize) => {
    setIconSize(newSize);
  }, []);

  // Handle color theme change
  const handleThemeChange = useCallback((newTheme) => {
    setColorTheme(newTheme);
  }, []);

  // Clear all selections
  const clearSelections = () => {
    setSelectedIcons([]);
  };

  // Select all visible icons (based on current filter)
  const selectAllVisible = () => {
    const visibleIcons = filterIcons(icons, filterCriteria);
    setSelectedIcons(visibleIcons);
  };

  // Helper function to filter icons based on criteria
  const filterIcons = (iconList, criteria) => {
    return iconList.filter(icon => {
      if (criteria.search) {
        const searchTerm = criteria.search.toLowerCase();
        return icon.name.toLowerCase().includes(searchTerm) ||
               icon.category.toLowerCase().includes(searchTerm) ||
               (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
      }
      if (criteria.category && criteria.category !== 'all') {
        return icon.category === criteria.category;
      }
      return true;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="visual-testing visual-testing--loading">
        <div className="visual-testing__loading">
          <div className="visual-testing__spinner"></div>
          <p>Loading SVA Icons...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="visual-testing visual-testing--error">
        <div className="visual-testing__error">
          <h2>Error Loading Icons</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="visual-testing__retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="visual-testing">
      {/* Header */}
      <header className="visual-testing__header">
        <div className="visual-testing__header-content">
          <div className="visual-testing__header-left">
            <h1 className="visual-testing__title">SVA Icon System</h1>
            
            {/* Data Source Info */}
            {dataSource && (
              <div className="visual-testing__data-source">
                <span className="visual-testing__data-source-label">Data Source:</span>
                <span className={`visual-testing__data-source-value visual-testing__data-source-value--${dataSource.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
                  {dataSource === 'built-package' && '🔧 Built Package (Real Data)'}
                  {dataSource === 'built-package-simulation' && '🔄 Built Package Simulation'}
                  {dataSource === 'mock-fallback' && '⚠️ Mock Fallback Data'}
                  {!['built-package', 'built-package-simulation', 'mock-fallback'].includes(dataSource) && `📄 ${dataSource}`}
                </span>
                {lastUpdated && (
                  <span className="visual-testing__last-updated">
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="visual-testing__nav">
            <button 
              className={`visual-testing__nav-btn ${activeSection === 'documentation' ? 'active' : ''}`}
              onClick={() => setActiveSection('documentation')}
            >
              Documentation
            </button>
            <button 
              className={`visual-testing__nav-btn ${activeSection === 'visual-grid' ? 'active' : ''}`}
              onClick={() => setActiveSection('visual-grid')}
            >
              Icons Grid
            </button>
            <button 
              className={`visual-testing__nav-btn ${activeSection === 'api-testing' ? 'active' : ''}`}
              onClick={() => setActiveSection('api-testing')}
            >
              API Testing
            </button>
          </nav>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="visual-testing__layout">
        {/* Conditional Sidebar - hide for documentation */}
        {activeSection !== 'documentation' && (
          <Sidebar
            icons={icons}
            filterCriteria={filterCriteria}
            onFilterChange={handleFilterChange}
            iconSize={iconSize}
            onSizeChange={handleSizeChange}
            colorTheme={colorTheme}
            onThemeChange={handleThemeChange}
            selectedIcons={selectedIcons}
            onClearSelections={clearSelections}
            onSelectAllVisible={selectAllVisible}
          />
        )}

        {/* Main Content */}
        <main className={`visual-testing__main ${activeSection === 'documentation' ? 'visual-testing__main--full-width' : ''}`}>
          {/* Documentation Section */}
          {activeSection === 'documentation' && (
            <DocumentationContainer 
              icons={icons}
              currentVersion="3.1.0"
            />
          )}

          {/* Visual Grid Section */}
          {activeSection === 'visual-grid' && (
            <div className="visual-testing__visual-section">
              <div className="visual-testing__main-header">
                <h2 className="visual-testing__main-title">Icon Grid & Controls</h2>
                <div className="visual-testing__main-stats">
                  <span className="visual-testing__main-stat">{icons.length} total</span>
                  <span className="visual-testing__main-stat">{filterIcons(icons, filterCriteria).length} visible</span>
                  {selectedIcons.length > 0 && (
                    <span className="visual-testing__main-stat visual-testing__main-stat--selected">
                      {selectedIcons.length} selected
                    </span>
                  )}
                </div>
              </div>
              <IconGrid 
                icons={icons}
                filterCriteria={filterCriteria}
                onIconSelect={handleIconSelect}
                selectedIcons={selectedIcons}
                iconSize={iconSize}
                colorTheme={colorTheme}
              />
            </div>
          )}

          {activeSection === 'api-testing' && (
            <div className="visual-testing__api-section">
              <div className="visual-testing__main-header">
                <h2 className="visual-testing__main-title">API Testing Suite</h2>
                <div className="visual-testing__main-stats">
                  <span className="visual-testing__main-stat">Phase 3: API Integration</span>
                  {selectedIcons.length > 0 && (
                    <span className="visual-testing__main-stat visual-testing__main-stat--selected">
                      {selectedIcons.length} icons selected for testing
                    </span>
                  )}
                </div>
              </div>
              <APITestingContainer 
                selectedIcons={selectedIcons}
                currentSize={iconSize}
                currentTheme={colorTheme}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="visual-testing__footer">
        <p>&copy; 2025 SVA Icons Visual Testing - Phase 3: API Testing Integration Complete ✅</p>
      </footer>
    </div>
  );
}

export default VisualTesting;
