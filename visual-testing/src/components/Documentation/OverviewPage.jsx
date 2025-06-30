import React from 'react';
import CodeExample from './CodeExample';

/**
 * Overview Page Component
 * 
 * Introduction and overview of SVA Icons system
 */
function OverviewPage({ icons, currentVersion }) {
  const iconCount = icons?.length || 0;
  const categories = icons ? [...new Set(icons.map(icon => icon.category))] : [];

  return (
    <div className="documentation-page">
      <div className="documentation-section">
        <h3>SVA Icon System</h3>
        <p className="documentation-intro">
          A modern, enterprise-ready icon system designed for automotive and framework integration. 
          Features function-based icons with configurable props, smart bundles, enhanced React components, 
          and comprehensive framework support.
        </p>

        <div className="documentation-highlights">
          <div className="documentation-highlight">
            <h4>🎯 Function-Based Icons</h4>
            <p>Configurable SVG icons with props support for size, color, accessibility, and more.</p>
          </div>
          <div className="documentation-highlight">
            <h4>🌐 Framework Agnostic</h4>
            <p>Works with React, Vue, Angular, vanilla JavaScript, and web components.</p>
          </div>
          <div className="documentation-highlight">
            <h4>📦 Tree-Shakable</h4>
            <p>Import only the icons you need for optimal bundle size.</p>
          </div>
          <div className="documentation-highlight">
            <h4>♿ Accessibility First</h4>
            <p>Built-in accessibility support with ARIA attributes and screen reader compatibility.</p>
          </div>
        </div>
      </div>

      <div className="documentation-section">
        <h3>What's New in v{currentVersion}</h3>
        <div className="documentation-new-features">
          <ul>
            <li><strong>Enhanced Performance:</strong> Improved icon loading and rendering speed</li>
            <li><strong>Expanded Icon Set:</strong> {iconCount} automotive and UI icons available</li>
            <li><strong>Better Developer Experience:</strong> Enhanced TypeScript support and documentation</li>
            <li><strong>Smart Bundles:</strong> Optimized icon bundles for specific use cases</li>
          </ul>
        </div>
      </div>

      <div className="documentation-section">
        <h3>Icon Statistics</h3>
        <div className="documentation-stats">
          <div className="documentation-stat">
            <span className="documentation-stat__number">{iconCount}</span>
            <span className="documentation-stat__label">Total Icons</span>
          </div>
          <div className="documentation-stat">
            <span className="documentation-stat__number">{categories.length}</span>
            <span className="documentation-stat__label">Categories</span>
          </div>
          <div className="documentation-stat">
            <span className="documentation-stat__number">8</span>
            <span className="documentation-stat__label">Usage Methods</span>
          </div>
          <div className="documentation-stat">
            <span className="documentation-stat__number">100%</span>
            <span className="documentation-stat__label">Tree-Shakable</span>
          </div>
        </div>
      </div>

      <div className="documentation-section">
        <h3>Quick Example</h3>
        <CodeExample
          title="Basic Usage"
          code={`import { Plus, Car, Alert } from 'sva-icons';

// Basic usage
const iconHtml = Plus();

// With configuration
const customIcon = Car({
  size: 32,
  color: 'blue',
  className: 'my-icon',
  'aria-label': 'Car icon'
});

// Use in HTML
document.getElementById('my-button').innerHTML = customIcon;`}
          language="javascript"
        />
      </div>

      <div className="documentation-section">
        <h3>Available Categories</h3>
        <div className="documentation-categories">
          {categories.map(category => (
            <span key={category} className="documentation-category-tag">
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="documentation-section">
        <h3>Browser Support</h3>
        <div className="documentation-browser-support">
          <div className="browser-support-grid">
            <div className="browser-support-item">
              <span className="browser-name">Chrome</span>
              <span className="browser-version">✅ 88+</span>
            </div>
            <div className="browser-support-item">
              <span className="browser-name">Firefox</span>
              <span className="browser-version">✅ 85+</span>
            </div>
            <div className="browser-support-item">
              <span className="browser-name">Safari</span>
              <span className="browser-version">✅ 14+</span>
            </div>
            <div className="browser-support-item">
              <span className="browser-name">Edge</span>
              <span className="browser-version">✅ 88+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;
