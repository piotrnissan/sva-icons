import React from 'react';

/**
 * Documentation Sidebar Component
 * 
 * Navigation sidebar for documentation sections
 */
function DocumentationSidebar({ activeSection, onSectionChange, sections }) {
  const sectionKeys = Object.keys(sections);

  return (
    <aside className="documentation-sidebar">
      <div className="documentation-sidebar__header">
        <h3 className="documentation-sidebar__title">Documentation</h3>
        <p className="documentation-sidebar__subtitle">
          Complete guide to SVA Icons
        </p>
      </div>

      <nav className="documentation-sidebar__nav">
        <ul className="documentation-sidebar__list">
          {sectionKeys.map(sectionKey => (
            <li 
              key={sectionKey}
              className="documentation-sidebar__item"
            >
              <button
                className={`documentation-sidebar__link ${
                  activeSection === sectionKey ? 'active' : ''
                }`}
                onClick={() => onSectionChange(sectionKey)}
              >
                {sections[sectionKey].title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="documentation-sidebar__footer">
        <div className="documentation-sidebar__links">
          <a 
            href="https://github.com/nissan/sva-icons" 
            target="_blank" 
            rel="noopener noreferrer"
            className="documentation-sidebar__external-link"
          >
            📁 GitHub Repository
          </a>
          <a 
            href="https://www.npmjs.com/package/sva-icons" 
            target="_blank" 
            rel="noopener noreferrer"
            className="documentation-sidebar__external-link"
          >
            📦 NPM Package
          </a>
        </div>
      </div>
    </aside>
  );
}

export default DocumentationSidebar;
