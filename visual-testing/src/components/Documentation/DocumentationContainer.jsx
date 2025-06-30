import React, { useState } from 'react';
import DocumentationSidebar from './DocumentationSidebar';
import OverviewPage from './OverviewPage';
import QuickStartPage from './QuickStartPage';
import UsagePage from './UsagePage';

/**
 * Documentation Container Component
 * 
 * Main container for the documentation section with sidebar navigation
 */
function DocumentationContainer({ icons, currentVersion }) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Overview',
      component: OverviewPage
    },
    quickstart: {
      title: 'Quick Start',
      component: QuickStartPage
    },
    usage: {
      title: 'Usage',
      component: UsagePage
    }
  };

  const ActiveComponent = sections[activeSection]?.component || OverviewPage;

  return (
    <div className="documentation-container">
      {/* Documentation Sidebar */}
      <DocumentationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sections={sections}
      />

      {/* Documentation Content */}
      <main className="documentation-content">
        <div className="documentation-content__header">
          <h2 className="documentation-content__title">
            {sections[activeSection]?.title || 'Overview'}
          </h2>
          <div className="documentation-content__meta">
            <span className="documentation-content__version">
              v{currentVersion || '3.0.0'}
            </span>
            <span className="documentation-content__icons-count">
              {icons?.length || 0} icons available
            </span>
          </div>
        </div>

        <div className="documentation-content__body">
          <ActiveComponent 
            icons={icons}
            currentVersion={currentVersion}
          />
        </div>
      </main>
    </div>
  );
}

export default DocumentationContainer;
