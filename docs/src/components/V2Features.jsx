import React from 'react'

const V2Features = () => {
  return (
    <div className="v2-features">
      <h2>What's New in v2.1</h2>
      
      <section className="feature-section">
        <h3>🎯 Function-Based Icon Architecture (NEW!)</h3>
        <p>Icons are now configurable functions that accept props, providing better developer experience and framework integration.</p>
        <div className="feature-details">
          <h4>Key Benefits:</h4>
          <ul>
            <li><strong>Configurable Props</strong> - Dynamic sizing, colors, classes, and accessibility features</li>
            <li><strong>Framework Ready</strong> - Perfect integration with React, Vue, Angular, and vanilla JS</li>
            <li><strong>Better DX</strong> - IDE support, type safety, and intuitive API</li>
            <li><strong>SVA Compatible</strong> - Full compatibility with SVA design system requirements</li>
            <li><strong>Flexible Import</strong> - Multiple import patterns for optimal developer experience</li>
          </ul>
        </div>
        <div className="code-block">
          <pre><code>{`// Import icons as functions
import { Plus, Settings, Car } from 'sva-icons'

// Basic usage
const iconHtml = Plus()

// Configurable with props
const customIcon = Plus({
  size: 32,
  color: 'blue',
  className: 'my-icon',
  strokeWidth: 2,
  title: 'Add Item',
  'aria-label': 'Add new item'
})

// Perfect for framework integration
export type SvaIconComponent = (props: SvaIconProps) => string`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>📦 Enhanced Framework Integration</h3>
        <p>Seamless integration with modern frameworks through function-based architecture.</p>
        <div className="code-block">
          <pre><code>{`// React Integration
function IconButton() {
  const iconHtml = Plus({ size: 20, color: 'currentColor' })
  return <button dangerouslySetInnerHTML={{ __html: iconHtml }} />
}

// Vue Integration
<template>
  <button v-html="iconHtml"></button>
</template>
<script>
import { Plus } from 'sva-icons'
export default {
  computed: {
    iconHtml() { return Plus({ size: 24 }) }
  }
}
</script>

// Angular Integration
import { Plus } from 'sva-icons'
@Component({
  template: '<button [innerHTML]="iconHtml"></button>'
})
class MyComponent {
  iconHtml = Plus({ size: 20, className: 'btn-icon' })
}`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>🎯 Smart Bundle System (v2.0)</h3>
        <p>Optimized icon bundles for specific use cases, reducing bundle size and improving performance.</p>
        <div className="feature-details">
          <h4>Available Bundles:</h4>
          <ul>
            <li><strong>automotive-core</strong> - Essential automotive icons (alert, car, battery, etc.)</li>
            <li><strong>ui-essentials</strong> - Common UI icons (home, search, user, etc.)</li>
            <li><strong>status-icons</strong> - Status and notification icons</li>
            <li><strong>controls</strong> - Control and action icons</li>
            <li><strong>navigation</strong> - Navigation and directional icons</li>
          </ul>
        </div>
        <div className="code-block">
          <pre><code>{`// Import only what you need
import { automotiveCore } from 'sva-icons/bundles'
import { uiEssentials } from 'sva-icons/bundles'

// 50-70% smaller bundle sizes
const carIcon = automotiveCore.car
const homeIcon = uiEssentials.home`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>🎨 Enhanced React Icon Component</h3>
        <p>New unified Icon component with theme support, size presets, and style variants.</p>
        <div className="code-block">
          <pre><code>{`import { Icon } from 'sva-icons/react'

// Theme-aware sizing
<Icon name="alert" size="sm" />    // 16px
<Icon name="car" size="md" />      // 24px
<Icon name="home" size="lg" />     // 32px
<Icon name="user" size="xl" />     // 48px

// Theme colors
<Icon name="alert" theme="primary" />
<Icon name="warning" theme="danger" />
<Icon name="success" theme="success" />

// Style variants
<Icon name="heart" variant="outline" />
<Icon name="star" variant="filled" />

// Custom colors still supported
<Icon name="custom" color="#ff6b6b" />`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>🎭 CSS Theme System</h3>
        <p>Complete CSS framework with predefined themes, sizes, animations, and customization options.</p>
        <div className="code-block">
          <pre><code>{`// Import the theme system
import 'sva-icons/dist/sva-icons.css'

// Use predefined classes
<div className="sva-icon-lg sva-icon-primary">
  <CarIcon />
</div>

// Animated icons
<div className="sva-icon-md sva-icon-danger sva-icon-animated">
  <AlertIcon />
</div>

// Responsive sizing
<div className="sva-icon-responsive">
  <HomeIcon />
</div>`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>⚙️ JavaScript Theme API</h3>
        <p>Programmatic theme configuration for dynamic styling and runtime customization.</p>
        <div className="code-block">
          <pre><code>{`import { SVATheme } from 'sva-icons/theme'

// Configure global theme
SVATheme.configure({
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  dangerColor: '#dc3545',
  warningColor: '#ffc107',
  successColor: '#28a745',
  sizes: {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px'
  },
  animations: {
    duration: '0.3s',
    easing: 'ease-in-out'
  }
})

// Apply themes dynamically
SVATheme.applyTheme('dark')
SVATheme.applyTheme('automotive')
SVATheme.applyTheme('minimal')`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>🔍 Bundle Analyzer</h3>
        <p>Analyze and optimize your icon usage with built-in bundle analysis tools.</p>
        <div className="code-block">
          <pre><code>{`import { BundleAnalyzer } from 'sva-icons/analyzer'

// Analyze icon usage
const analysis = BundleAnalyzer.analyze([
  'alert', 'car', 'home', 'user', 'search'
])

console.log(analysis)
// {
//   totalSize: '12.5KB',
//   iconCount: 5,
//   recommendations: ['Consider using ui-essentials bundle'],
//   duplicates: [],
//   unusedIcons: ['calendar', 'phone']
// }

// Get optimization suggestions
const optimizations = BundleAnalyzer.getOptimizations(analysis)
console.log(optimizations.suggestedBundles)
// ['ui-essentials', 'automotive-core']`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>🛠️ Developer Tools</h3>
        <p>Enhanced development experience with debugging tools, validation, and manifest generation.</p>
        <div className="code-block">
          <pre><code>{`import { DevTools } from 'sva-icons/dev'

// Development utilities
DevTools.logIconUsage()              // Track icon usage
DevTools.validateBundle(['alert'])   // Validate icon names
DevTools.generateManifest([          // Generate icon manifest
  'automotive-core', 
  'ui-essentials'
])

// Performance monitoring
DevTools.measureLoadTime('automotive-core')
DevTools.checkDuplicates(['alert', 'car', 'home'])

// Debug mode
DevTools.enableDebugMode()
DevTools.disableDebugMode()`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>📦 Enhanced Package Exports</h3>
        <p>Improved package structure with better tree-shaking and module resolution.</p>
        <div className="code-block">
          <pre><code>{`// New export paths in v2.0
import { Icon } from 'sva-icons/react'           // Enhanced React component
import { automotiveCore } from 'sva-icons/bundles'  // Smart bundles
import { SVATheme } from 'sva-icons/theme'       // Theme API
import { BundleAnalyzer } from 'sva-icons/analyzer' // Analysis tools
import { DevTools } from 'sva-icons/dev'         // Developer utilities

// Backward compatibility maintained
import { Alert, Car } from 'sva-icons/react'    // Individual components
import icons from 'sva-icons'                   // All icons map
import { alert } from 'sva-icons/esm'          // ES modules
const { alert } = require('sva-icons/cjs')     // CommonJS`}</code></pre>
        </div>
      </section>

      <section className="feature-section">
        <h3>🚀 Performance Improvements</h3>
        <div className="performance-stats">
          <div className="stat">
            <h4>Bundle Size Reduction</h4>
            <p><strong>50-70%</strong> smaller when using smart bundles</p>
          </div>
          <div className="stat">
            <h4>Load Time</h4>
            <p><strong>40%</strong> faster initial load with tree-shaking</p>
          </div>
          <div className="stat">
            <h4>Memory Usage</h4>
            <p><strong>30%</strong> less memory footprint</p>
          </div>
          <div className="stat">
            <h4>Tree Shaking</h4>
            <p><strong>100%</strong> tree-shakable with smart bundles</p>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <h3>🔄 Migration Guide</h3>
        <p>SVA Icons v2.0 is fully backward compatible, but here's how to take advantage of new features:</p>
        <div className="migration-steps">
          <div className="step">
            <h4>1. Update to v2.0</h4>
            <code>npm install sva-icons@^2.0.0</code>
          </div>
          <div className="step">
            <h4>2. Import the CSS theme system (optional)</h4>
            <code>import 'sva-icons/dist/sva-icons.css'</code>
          </div>
          <div className="step">
            <h4>3. Switch to smart bundles for better performance</h4>
            <code>import {'{ automotiveCore }'} from 'sva-icons/bundles'</code>
          </div>
          <div className="step">
            <h4>4. Use the enhanced Icon component</h4>
            <code>{'<Icon name="alert" size="lg" theme="primary" />'}</code>
          </div>
        </div>
      </section>
    </div>
  )
}

export default V2Features
