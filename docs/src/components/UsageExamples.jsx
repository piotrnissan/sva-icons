import React from 'react'

const UsageExamples = () => {
  return (
    <div className="usage-examples">
      <h2>Usage Examples</h2>
      
      <section className="usage-section">
        <h3>Installation</h3>
        <div className="code-block">
          <pre><code>{`npm install sva-icons`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>🎯 Function-Based Icons (v2.1 NEW!)</h3>
        <div className="code-block">
          <pre><code>{`// Import icons as configurable functions
import { Plus, Minus, Settings, Car } from 'sva-icons'

// Basic usage - returns SVG string
const iconHtml = Plus()

// Configurable with props
const customIcon = Plus({
  size: 32,
  color: 'blue',
  className: 'my-custom-icon',
  strokeWidth: 2,
  title: 'Add Item',
  'aria-label': 'Add new item'
})

// Use in HTML
document.getElementById('my-button').innerHTML = customIcon

// Framework Integration Examples:

// React
function IconButton() {
  return (
    <button>
      <span dangerouslySetInnerHTML={{ __html: Plus({ size: 20 }) }} />
      Add Item
    </button>
  )
}

// Vue
<template>
  <button v-html="plusIcon"></button>
</template>
<script>
import { Plus } from 'sva-icons'
export default {
  computed: {
    plusIcon() {
      return Plus({ size: 24, color: 'currentColor' })
    }
  }
}
</script>

// Angular
import { Plus } from 'sva-icons'
@Component({
  template: '<button [innerHTML]="iconHtml"></button>'
})
class MyComponent {
  iconHtml = Plus({ size: 20, className: 'btn-icon' })
}`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>📦 SVA Framework Integration (v2.1)</h3>
        <div className="code-block">
          <pre><code>{`// Perfect for SVA design system integration
import { Alert, Car, Settings, Plus } from 'sva-icons'

// SVA Framework compatible function interface
export type SvaIconComponent = (props: SvaIconProps) => string

// Available props interface
interface SvaIconProps {
  size?: number | string
  color?: string
  className?: string
  strokeWidth?: number
  title?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
  focusable?: boolean
}

// Usage in SVA components
const iconHtml = Alert({
  size: 24,
  color: 'var(--sva-color-danger)',
  className: 'sva-alert__icon',
  'aria-hidden': true
})`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Enhanced React Components (v2.0)</h3>
        <div className="code-block">
          <pre><code>{`// Import individual components
import { Alert, Car, Calendar } from 'sva-icons/react'

// Or use the enhanced Icon component
import { Icon } from 'sva-icons/react'

function MyComponent() {
  return (
    <div>
      {/* Individual components */}
      <Alert size={24} color="red" />
      <Car size={32} color="blue" />
      <Calendar size={16} />
      
      {/* Enhanced Icon component with theme support */}
      <Icon name="alert" size="lg" theme="primary" />
      <Icon name="car" size="xl" variant="outline" />
      <Icon name="calendar" size="sm" color="#333" />
    </div>
  )
}`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Smart Bundles (v2.0)</h3>
        <div className="code-block">
          <pre><code>{`// Import specific bundles for optimized loading
import { automotiveCore } from 'sva-icons/bundles'
import { uiEssentials } from 'sva-icons/bundles'
import { statusIcons } from 'sva-icons/bundles'
import { controls } from 'sva-icons/bundles'
import { navigation } from 'sva-icons/bundles'

// Use bundle icons
const alertIcon = automotiveCore.alert
const carIcon = automotiveCore.car
const homeIcon = navigation.home`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Theme System (v2.0)</h3>
        <div className="code-block">
          <pre><code>{`// Import CSS theme system
import 'sva-icons/dist/sva-icons.css'

// Use theme classes
<div className="sva-icon-sm sva-icon-primary">...</div>
<div className="sva-icon-lg sva-icon-secondary">...</div>
<div className="sva-icon-xl sva-icon-danger sva-icon-animated">...</div>

// Or use JavaScript theme API
import { SVATheme } from 'sva-icons/theme'

SVATheme.configure({
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  dangerColor: '#dc3545',
  sizes: {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  }
})`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Developer Tools (v2.0)</h3>
        <div className="code-block">
          <pre><code>{`// Bundle analyzer
import { BundleAnalyzer } from 'sva-icons/analyzer'

const analysis = BundleAnalyzer.analyze(['alert', 'car', 'home'])
console.log(analysis.totalSize, analysis.recommendations)

// Development utilities
import { DevTools } from 'sva-icons/dev'

DevTools.logIconUsage()
DevTools.validateBundle(['alert', 'car'])
DevTools.generateManifest(['automotive-core', 'ui-essentials'])`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Web Components</h3>
        <div className="code-block">
          <pre><code>{`<script type="module" src="./dist/web-components/sva-icon.js"></script>

<sva-icon name="alert" size="24" color="red"></sva-icon>
<sva-icon name="car" size="32" color="blue"></sva-icon>
<sva-icon name="calendar" size="16"></sva-icon>`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>SVG Sprite</h3>
        <div className="code-block">
          <pre><code>{`<!-- Include the sprite -->
<script>
  fetch('./dist/sprite/sva-icons-sprite.svg')
    .then(r => r.text())
    .then(svg => {
      document.body.insertAdjacentHTML('afterbegin', svg)
    })
</script>

<!-- Use icons -->
<svg width="24" height="24">
  <use href="#alert"></use>
</svg>`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>ES Modules</h3>
        <div className="code-block">
          <pre><code>{`import { alert } from 'sva-icons/esm'

// alert is the SVG string
document.getElementById('icon').innerHTML = alert`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>CommonJS</h3>
        <div className="code-block">
          <pre><code>{`const { alert } = require('sva-icons/cjs')

// alert is the SVG string
document.getElementById('icon').innerHTML = alert`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Vanilla JavaScript</h3>
        <div className="code-block">
          <pre><code>{`// Load the icon map
import icons from 'sva-icons'

// Get icon SVG
const alertSvg = icons.alert
document.getElementById('icon').innerHTML = alertSvg`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Theming & Styling (v2.0)</h3>
        <div className="code-block">
          <pre><code>{`/* Import the CSS theme system */
@import 'sva-icons/dist/sva-icons.css';

/* CSS Variables for theming */
:root {
  --sva-icon-primary: #007bff;
  --sva-icon-secondary: #6c757d;
  --sva-icon-danger: #dc3545;
  --sva-icon-warning: #ffc107;
  --sva-icon-size-sm: 16px;
  --sva-icon-size-md: 24px;
  --sva-icon-size-lg: 32px;
  --sva-icon-size-xl: 48px;
}

/* Use theme classes */
.my-icon {
  @apply sva-icon-lg sva-icon-primary sva-icon-animated;
}

/* Web Component styling */
sva-icon {
  color: var(--primary-color);
  width: var(--sva-icon-size-md);
  height: var(--sva-icon-size-md);
}`}</code></pre>
        </div>
      </section>

      <section className="usage-section">
        <h3>Accessibility</h3>
        <div className="code-block">
          <pre><code>{`<!-- React -->
<Alert aria-label="Warning message" role="img" />

<!-- Web Component -->
<sva-icon name="alert" aria-label="Warning message" role="img"></sva-icon>

<!-- SVG -->
<svg aria-label="Warning message" role="img">
  <use href="#alert"></use>
</svg>`}</code></pre>
        </div>
      </section>
    </div>
  )
}

export default UsageExamples
