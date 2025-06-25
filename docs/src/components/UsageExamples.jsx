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
        <h3>React Components</h3>
        <div className="code-block">
          <pre><code>{`import { Alert, Car, Calendar } from 'sva-icons/react'

function MyComponent() {
  return (
    <div>
      <Alert size={24} color="red" />
      <Car size={32} color="blue" />
      <Calendar size={16} />
    </div>
  )
}`}</code></pre>
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
        <h3>Theming & Styling</h3>
        <div className="code-block">
          <pre><code>{`/* CSS Variables for Web Components */
:root {
  --sva-icon-color: #333;
  --sva-icon-size: 24px;
}

/* Direct styling */
sva-icon {
  color: var(--primary-color);
  width: 2rem;
  height: 2rem;
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
