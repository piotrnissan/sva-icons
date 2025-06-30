import React, { useState } from 'react';
import SimpleClassBasedTest from './SimpleClassBasedTest';
import SimpleWebComponentsTest from './SimpleWebComponentsTest';
import SimpleReactComponentsTest from './SimpleReactComponentsTest';

/**
 * API Testing Container Component
 * Manages the different API testing sections (Phase 3)
 * Phase 3 of Visual Testing Implementation Plan
 */
const APITestingContainer = ({ selectedIcons, currentSize, currentTheme }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      title: 'Overview',
      icon: '📋',
      description: 'API testing overview and status'
    },
    {
      id: 'class-based',
      title: 'Class-Based API',
      icon: '🎯',
      description: 'Test sva-icon-* CSS classes'
    },
    {
      id: 'web-components',
      title: 'Web Components',
      icon: '🧩',
      description: 'Test <sva-icon> elements'
    },
    {
      id: 'react-components',
      title: 'React Components',
      icon: '⚛️',
      description: 'Test React function components'
    }
  ];

  const renderOverview = () => (
    <div className="api-overview">
      <div className="overview-header">
        <h3>🚀 API Testing Suite</h3>
        <p>Test all SVA Icons implementation methods with your selected icons</p>
      </div>

      <div className="testing-status">
        <div className="status-card">
          <div className="status-header">
            <span className="status-icon">🎯</span>
            <span className="status-title">Class-Based API</span>
          </div>
          <div className="status-content">
            <p>Test CSS class-based implementation</p>
            <ul>
              <li>✅ Basic class application</li>
              <li>✅ Size and color modifiers</li>
              <li>✅ Dynamic class changes</li>
              <li>✅ Mutation observer functionality</li>
            </ul>
          </div>
        </div>

        <div className="status-card">
          <div className="status-header">
            <span className="status-icon">🧩</span>
            <span className="status-title">Web Components</span>
          </div>
          <div className="status-content">
            <p>Test custom element implementation</p>
            <ul>
              <li>✅ Basic &lt;sva-icon&gt; usage</li>
              <li>✅ Attribute passing</li>
              <li>✅ Event handling</li>
              <li>✅ CSS variable integration</li>
            </ul>
          </div>
        </div>

        <div className="status-card">
          <div className="status-header">
            <span className="status-icon">⚛️</span>
            <span className="status-title">React Components</span>
          </div>
          <div className="status-content">
            <p>Test React function components</p>
            <ul>
              <li>✅ Component imports</li>
              <li>✅ Props passing</li>
              <li>✅ Tree-shaking verification</li>
              <li>✅ Performance testing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="current-selection">
        <h4>📊 Current Test Configuration</h4>
        <div className="config-grid">
          <div className="config-item">
            <span className="config-label">Selected Icons:</span>
            <span className="config-value">{selectedIcons.length} icons</span>
          </div>
          <div className="config-item">
            <span className="config-label">Current Size:</span>
            <span className="config-value">{currentSize}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Current Theme:</span>
            <span className="config-value">{currentTheme}</span>
          </div>
        </div>
        
        {selectedIcons.length > 0 && (
          <div className="selected-icons-preview">
            <h5>Selected Icons:</h5>
            <div className="icons-list">
              {selectedIcons.slice(0, 10).map(icon => (
                <span key={icon.name} className="icon-tag">{icon.name}</span>
              ))}
              {selectedIcons.length > 10 && (
                <span className="icon-tag more">+{selectedIcons.length - 10} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="getting-started">
        <h4>🚦 Getting Started</h4>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h5>Select Icons</h5>
              <p>Choose icons from the main grid to test with</p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h5>Choose API</h5>
              <p>Select an API testing tab (Class-Based, Web Components, or React)</p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <h5>Run Tests</h5>
              <p>Execute tests and review results for each implementation</p>
            </div>
          </div>
        </div>
      </div>

      {selectedIcons.length === 0 && (
        <div className="no-selection">
          <div className="no-selection-content">
            <span className="no-selection-icon">🎯</span>
            <h4>No Icons Selected</h4>
            <p>Please select some icons from the main grid to start testing APIs</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'class-based':
        return <SimpleClassBasedTest selectedIcons={selectedIcons} />;
      case 'web-components':
        return <SimpleWebComponentsTest selectedIcons={selectedIcons} />;
      case 'react-components':
        return <SimpleReactComponentsTest selectedIcons={selectedIcons} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="api-testing-container">
      <div className="api-testing-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-title">{tab.title}</span>
            <span className="tab-description">{tab.description}</span>
          </button>
        ))}
      </div>

      <div className="api-testing-content">
        {renderActiveContent()}
      </div>

      <style jsx>{`
        .api-testing-container {
          width: 100%;
        }

        .api-testing-tabs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .tab-button {
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          position: relative;
        }

        .tab-button:hover {
          border-color: #1a73e8;
          box-shadow: 0 4px 12px rgba(26, 115, 232, 0.1);
        }

        .tab-button.active {
          border-color: #1a73e8;
          background: #e3f2fd;
          box-shadow: 0 4px 12px rgba(26, 115, 232, 0.2);
        }

        .tab-icon {
          font-size: 24px;
          display: block;
          margin-bottom: 10px;
        }

        .tab-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          display: block;
          margin-bottom: 5px;
        }

        .tab-description {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }

        .api-testing-content {
          min-height: 400px;
        }

        .api-overview {
          padding: 20px 0;
        }

        .overview-header h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .overview-header p {
          margin: 0 0 30px 0;
          color: #666;
          font-size: 16px;
        }

        .testing-status {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .status-card {
          padding: 25px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .status-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .status-icon {
          font-size: 24px;
          margin-right: 12px;
        }

        .status-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .status-content p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .status-content ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .status-content li {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }

        .current-selection {
          padding: 25px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .current-selection h4 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .config-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .config-label {
          font-weight: 500;
          color: #666;
        }

        .config-value {
          font-weight: 600;
          color: #333;
        }

        .selected-icons-preview h5 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .icons-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .icon-tag {
          padding: 4px 8px;
          background: #e3f2fd;
          color: #1a73e8;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .icon-tag.more {
          background: #f1f3f4;
          color: #666;
        }

        .getting-started {
          margin-bottom: 30px;
        }

        .getting-started h4 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .step {
          display: flex;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          background: white;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: #1a73e8;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .step-content h5 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 16px;
        }

        .step-content p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .no-selection {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          border: 2px dashed #e0e0e0;
          border-radius: 12px;
          background: #fafafa;
        }

        .no-selection-content {
          text-align: center;
        }

        .no-selection-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 15px;
        }

        .no-selection-content h4 {
          margin: 0 0 10px 0;
          color: #666;
        }

        .no-selection-content p {
          margin: 0;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default APITestingContainer;
