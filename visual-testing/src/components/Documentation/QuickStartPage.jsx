import React from 'react';
import CodeExample from './CodeExample';

/**
 * Quick Start Page Component
 * 
 * Getting started guide with installation and basic usage
 */
function QuickStartPage({ currentVersion }) {
  return (
    <div className="documentation-page">
      <div className="documentation-section">
        <h3>Installation</h3>
        <p>Get started with SVA Icons in seconds using your preferred package manager.</p>

        <div className="documentation-install-options">
          <CodeExample
            title="NPM"
            code={`npm install sva-icons@^${currentVersion || '3.0.0'}`}
            language="bash"
            copyable={true}
          />

          <CodeExample
            title="Yarn"
            code={`yarn add sva-icons@^${currentVersion || '3.0.0'}`}
            language="bash"
            copyable={true}
          />

          <CodeExample
            title="PNPM"
            code={`pnpm add sva-icons@^${currentVersion || '3.0.0'}`}
            language="bash"
            copyable={true}
          />
        </div>
      </div>

      <div className="documentation-section">
        <h3>CDN Usage (No Install Required)</h3>
        <p>For quick prototyping or simple projects, use the CDN directly:</p>

        <CodeExample
          title="Function-based Icons"
          code={`<!-- Include the library -->
<script src="https://unpkg.com/sva-icons@${currentVersion || '3.0.0'}/dist/icons/index.js"></script>

<!-- Use in your HTML -->
<script>
  const iconHtml = SvaIcons.Plus({ size: 24, color: 'blue' });
  document.getElementById('my-icon').innerHTML = iconHtml;
</script>`}
          language="html"
          copyable={true}
        />
      </div>

      <div className="documentation-section">
        <h3>Auto-Registration (New in v3.1+)</h3>
        <p>The easiest way to use SVA Icons - automatic registration for class-based icons:</p>

        <CodeExample
          title="Zero Configuration Setup"
          code={`<!-- 1. Add import map for clean imports -->
<script type="importmap">
{
  "imports": {
    "sva-icons/class-based": "./node_modules/sva-icons/dist/class-based/esm/index.js"
  }
}
</script>

<!-- 2. Initialize auto-registration -->
<script type="module">
  import { initializeClassBasedIcons } from 'sva-icons/class-based';
  
  // Scans DOM and auto-registers icons
  await initializeClassBasedIcons({
    scanDOM: true,
    prefix: 'sva-icon-'
  });
</script>

<!-- 3. Use icons anywhere in HTML -->
<div class="sva-icon-plus"></div>
<div class="sva-icon-car"></div>
<div class="sva-icon-settings"></div>`}
          language="html"
          copyable={true}
        />

        <CodeExample
          title="Bundle Registration"
          code={`// Register predefined bundles of icons
import { initializeClassBasedIcons } from 'sva-icons/class-based';

await initializeClassBasedIcons({
  registerBundles: ['ui-essentials', 'automotive-core'],
  prefix: 'sva-icon-',
  enableObserver: true  // Watch for dynamic content
});

// Available bundles:
// - ui-essentials: plus, minus, settings, search, filter, etc.
// - automotive-core: car, battery, charging, alert, speed, etc.
// - navigation: arrows, directions, map-view, etc.
// - communication: phone, email, chat, message, etc.
// - media: play, pause, volume, camera, video, etc.`}
          language="javascript"
          copyable={true}
        />
      </div>

      <div className="documentation-section">
        <h3>Function-Based Icons</h3>
        <p>For programmatic usage, import individual icon functions:</p>

        <CodeExample
          title="ES6 Imports"
          code={`import { Plus, Minus, Car, Settings } from 'sva-icons';

// Basic usage - returns SVG string (strokeWidth: 0 by default in v3.1+)
const iconHtml = Plus({ size: 24 });

// With configuration
const customIcon = Car({
  size: 32,
  color: 'blue',
  className: 'car-icon',
  'aria-label': 'Vehicle'
});

// Use in your application
document.getElementById('button').innerHTML = Plus() + ' Add Item';`}
          language="javascript"
          copyable={true}
        />
      </div>

      <div className="documentation-section">
        <h3>React Integration</h3>
        <p>Use SVA Icons in React applications with dangerouslySetInnerHTML or React components:</p>

        <CodeExample
          title="React Usage"
          code={`import { Plus, Car } from 'sva-icons';

function IconButton({ onClick }) {
  const iconHtml = Plus({ 
    size: 20, 
    color: 'currentColor',
    'aria-hidden': true
  });
  
  return (
    <button onClick={onClick} aria-label="Add item">
      <span dangerouslySetInnerHTML={{ __html: iconHtml }} />
      Add Item
    </button>
  );
}`}
          language="jsx"
          copyable={true}
        />
      </div>

      <div className="documentation-section">
        <h3>HTML/CSS Usage</h3>
        <p>For traditional HTML projects or when migrating from icon fonts:</p>

        <CodeExample
          title="HTML with createIcons"
          code={`<!-- HTML -->
<button class="btn">
  <i data-sva-icon="plus"></i>
  Add Item
</button>

<script type="module">
import { createIcons } from 'sva-icons/create-icons';
import plus from 'sva-icons/dist/icons/esm/plus.js';

// Initialize icons (tree-shakable)
createIcons({
  icons: { plus }
});
</script>`}
          language="html"
          copyable={true}
        />
      </div>

      <div className="documentation-section">
        <h3>Icon Props Interface</h3>
        <p>All SVA icons accept these configurable properties:</p>

        <CodeExample
          title="TypeScript Interface"
          code={`interface SvaIconProps {
  size?: number | string;        // Icon size (default: 24)
  color?: string;               // Icon color (default: 'currentColor')
  className?: string;           // CSS classes to apply
  strokeWidth?: number;         // Stroke width (default: 1.5)
  title?: string;              // Accessibility title
  focusable?: boolean;         // Whether icon is focusable
  'aria-hidden'?: boolean;     // Hide from screen readers
  'aria-label'?: string;       // Accessibility label
  [key: string]: any;          // Additional SVG attributes
}`}
          language="typescript"
          copyable={true}
        />
      </div>

      <div className="documentation-section">
        <h3>Next Steps</h3>
        <div className="documentation-next-steps">
          <div className="next-step">
            <h4>📖 Explore Usage Patterns</h4>
            <p>Check out the <strong>Usage</strong> section for advanced integration patterns and framework-specific examples.</p>
          </div>
          <div className="next-step">
            <h4>🎨 Browse Icon Grid</h4>
            <p>Use the <strong>Icons Grid</strong> tab to explore all available icons with live preview and copy functionality.</p>
          </div>
          <div className="next-step">
            <h4>🧪 Test API Integration</h4>
            <p>Try the <strong>API Testing</strong> section to test different usage methods with real icons.</p>
          </div>
        </div>
      </div>

      <div className="documentation-section">
        <h3>Common Patterns</h3>
        <div className="documentation-patterns">
          <CodeExample
            title="Button with Icon"
            code={`import { Plus } from 'sva-icons';

const addButton = \`
  <button class="btn btn-primary">
    \${Plus({ size: 16 })}
    Add Item
  </button>
\`;`}
            language="javascript"
          />

          <CodeExample
            title="Icon with Different States"
            code={`import { Alert } from 'sva-icons';

// Different states with colors
const errorIcon = Alert({ color: '#dc3545', size: 20 });
const warningIcon = Alert({ color: '#ffc107', size: 20 });
const infoIcon = Alert({ color: '#17a2b8', size: 20 });`}
            language="javascript"
          />
        </div>
      </div>
    </div>
  );
}

export default QuickStartPage;
