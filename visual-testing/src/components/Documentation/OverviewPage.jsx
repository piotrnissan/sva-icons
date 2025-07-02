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
            <li><strong>🚀 Auto-Registration System:</strong> Smart class-based icon registration with DOM scanning</li>
            <li><strong>📦 Bundle System:</strong> Predefined icon bundles (ui-essentials, automotive-core, etc.)</li>
            <li><strong>🎯 Zero Configuration:</strong> Automatic icon discovery from HTML classes</li>
            <li><strong>🔧 Import Maps:</strong> Clean imports for browser development and VS Code Live Preview</li>
            <li><strong>✨ Visual Consistency:</strong> Default strokeWidth: 0 for SVA design system alignment</li>
            <li><strong>⚡ Dynamic Content:</strong> Mutation observer for SPA and dynamic applications</li>
            <li><strong>🌐 Browser-First:</strong> Enhanced support for unbundled development</li>
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
          title="Auto-Registration (New in v3.1+)"
          code={`// 🚀 NEW: Auto-registration with bundles
import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

// Register icon bundles
await initializeClassBasedIcons({
  registerBundles: ['ui-essentials', 'automotive-core'],
  prefix: 'sva-icon-'
});

// Or use DOM scanning (zero config!)
await initializeClassBasedIcons({
  scanDOM: true,  // Finds class="sva-icon-*" automatically
  prefix: 'sva-icon-'
});

// Then use in HTML - icons auto-inject!
// <div class="sva-icon-plus"></div>
// <div class="sva-icon-car"></div>`}
          language="javascript"
        />
        
        <CodeExample
          title="Function-Based Icons"
          code={`import { Plus, Car, Alert } from 'sva-icons';

// Basic usage (strokeWidth: 0 by default in v3.1+)
const iconHtml = Plus({ size: 24 });

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
