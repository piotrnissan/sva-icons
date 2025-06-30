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
        <h3>Basic Usage</h3>
        <p>Import and use icons in your JavaScript/TypeScript projects:</p>

        <CodeExample
          title="ES6 Imports"
          code={`import { Plus, Minus, Car, Settings } from 'sva-icons';

// Basic usage - returns SVG string
const iconHtml = Plus();

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
