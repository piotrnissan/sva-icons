# SVA Icons v3.0: Complete Usage Guide

A modern, enterprise-ready icon system designed for automotive and framework integration. Features function-based icons with configurable props, smart bundles, enhanced React components, and comprehensive framework support.

**✨ New in v3.0:** Enhanced version with improved performance, expanded icon set, and refined developer experience.

---

## Installation

### Package Managers

```sh
npm install sva-icons@^3.0.0
# or
yarn add sva-icons@^3.0.0
# or
pnpm add sva-icons@^3.0.0
```

### CDN

```html
<!-- Function-based icons (v3.0) -->
<script src="https://unpkg.com/sva-icons@3.0/dist/icons/index.js"></script>

<!-- Web Components -->
<script src="https://unpkg.com/sva-icons@3.0/dist/web-components/sva-icon.umd.js"></script>

<!-- CSS Theme System -->
<link rel="stylesheet" href="https://unpkg.com/sva-icons@3.0/dist/sva-icons.css">
```

---

## Usage Methods

### 1. Function-Based Icons (v2.1 NEW!) ⭐

The most modern and flexible approach with configurable props:

```javascript
import { Plus, Minus, Car, Settings } from 'sva-icons';

// Basic usage - returns SVG string
const iconHtml = Plus();

// Configurable with props
const customIcon = Plus({
  size: 32,
  color: 'blue',
  className: 'my-custom-icon',
  strokeWidth: 2,
  title: 'Add Item',
  'aria-label': 'Add new item'
});

// Use in HTML
document.getElementById('my-button').innerHTML = customIcon;
```

#### Props Interface
```typescript
interface SvaIconProps {
  size?: number | string;        // Icon size (default: 24)
  color?: string;               // Icon color (default: 'currentColor')
  className?: string;           // CSS classes to apply
  strokeWidth?: number;         // Stroke width (default: 1.5)
  title?: string;              // Accessibility title
  focusable?: boolean;         // Whether icon is focusable
  'aria-hidden'?: boolean;     // Hide from screen readers
  'aria-label'?: string;       // Accessibility label
  [key: string]: any;          // Additional SVG attributes
}
```

### 2. Framework Integration

#### React Integration
```jsx
import { Plus, Settings, Car } from 'sva-icons';

function IconButton({ onClick }) {
  const iconHtml = Plus({ 
    size: 20, 
    color: 'currentColor',
    className: 'button-icon',
    'aria-hidden': true
  });
  
  return (
    <button onClick={onClick} aria-label="Add item">
      <span dangerouslySetInnerHTML={{ __html: iconHtml }} />
      Add Item
    </button>
  );
}

// Or with React components
import { Plus as PlusComponent } from 'sva-icons/react';

function ReactApp() {
  return (
    <button>
      <PlusComponent size={20} color="currentColor" />
      Add Item
    </button>
  );
}
```

#### Vue Integration
```vue
<template>
  <button @click="handleClick" :aria-label="buttonLabel">
    <span v-html="iconHtml"></span>
    {{ buttonText }}
  </button>
</template>

<script>
import { Plus } from 'sva-icons';

export default {
  props: {
    size: { type: Number, default: 20 },
    color: { type: String, default: 'currentColor' }
  },
  computed: {
    iconHtml() {
      return Plus({ 
        size: this.size, 
        color: this.color,
        'aria-hidden': true
      });
    }
  }
}
</script>
```

#### Angular Integration
```typescript
import { Component, Input } from '@angular/core';
import { Plus } from 'sva-icons';

@Component({
  selector: 'app-icon-button',
  template: `
    <button [attr.aria-label]="ariaLabel">
      <span [innerHTML]="iconHtml"></span>
      <ng-content></ng-content>
    </button>
  `
})
export class IconButtonComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() ariaLabel: string = '';

  get iconHtml() {
    return Plus({ 
      size: this.size, 
      color: this.color,
      'aria-hidden': true
    });
  }
}
```

### 3. Smart Bundles (v2.1)

Import optimized bundles for specific use cases:

```javascript
// Import specific bundles
import { automotiveCore } from 'sva-icons/bundles';
import { uiEssentials } from 'sva-icons/bundles';
import { statusIcons } from 'sva-icons/bundles';

// Use bundle icons (function-based)
const carIcon = automotiveCore.car({ size: 24, color: 'blue' });
const alertIcon = automotiveCore.alert({ size: 20, color: 'red' });
const homeIcon = uiEssentials.home({ size: 24 });
const searchIcon = uiEssentials.search({ size: 20 });
```

**Available Bundles:**
- `automotive-core` - Essential automotive icons (50-70% smaller)
- `ui-essentials` - Common UI icons
- `status-icons` - Status and notification icons
- `controls` - Control and action icons
- `navigation` - Navigation and directional icons

### 4. Button Integration (Legacy Migration)

Perfect for migrating from CSS `::before` pseudo-elements:

```html
<!-- HTML -->
<button class="sva-c-button sva-c-button--hotspot">
  <i data-sva-icon="plus" class="sva-c-button__icon"></i>
  Add Item
</button>
```

```javascript
// Tree-shakable: only import icons you need
import { createIcons } from 'sva-icons/create-icons';
import plus from 'sva-icons/dist/icons/esm/plus.js';
import minus from 'sva-icons/dist/icons/esm/minus.js';

// Initialize icons (replaces all data-sva-icon elements)
createIcons({
  icons: { plus, minus } // Only these icons will be bundled
});
```

### 5. Web Components

#### Standard Web Components
```html
<sva-icon name="car" size="24" color="blue" aria-label="Car"></sva-icon>
<sva-icon name="battery" size="32" color="green" title="Battery status"></sva-icon>
```

#### Tree-shakable Web Components
```html
<script type="module">
import { SvaIconRegistry } from 'sva-icons/web-components/tree-shakable';
import plus from 'sva-icons/dist/icons/esm/plus.js';
import minus from 'sva-icons/dist/icons/esm/minus.js';

// Register only the icons you need
SvaIconRegistry.registerMultiple({ plus, minus });
</script>

<sva-button variant="hotspot" icon="plus">Add Item</sva-button>
<sva-button variant="hotspot" icon="minus" size="small">Remove</sva-button>
```

### 6. CSS Theme System (v2.1)

```css
/* Import the theme system */
@import 'sva-icons/dist/sva-icons.css';

/* Use predefined classes */
.sva-icon-sm { width: 16px; height: 16px; }
.sva-icon-md { width: 24px; height: 24px; }
.sva-icon-lg { width: 32px; height: 32px; }
.sva-icon-xl { width: 48px; height: 48px; }

.sva-icon-primary { color: var(--sva-icon-primary); }
.sva-icon-secondary { color: var(--sva-icon-secondary); }
.sva-icon-danger { color: var(--sva-icon-danger); }

.sva-icon-animated { transition: all 0.3s ease; }
.sva-icon-spinning { animation: spin 1s linear infinite; }

/* Custom theme variables */
:root {
  --sva-icon-primary: #007bff;
  --sva-icon-secondary: #6c757d;
  --sva-icon-danger: #dc3545;
  --sva-icon-warning: #ffc107;
  --sva-icon-success: #28a745;
}
```

### 7. Class-Based API (v2.1)

Advanced API for dynamic icon management:

```javascript
import { SvaIcons } from 'sva-icons/class-based';

// Initialize with configuration
const iconManager = new SvaIcons({
  defaultSize: '24px',
  defaultColor: 'currentColor',
  performance: {
    enabled: true,
    batchSize: 50
  },
  accessibility: {
    enabled: true,
    autoAria: true
  }
});

// Scan and inject icons
iconManager.init();
const elements = iconManager.scan();
await iconManager.inject();

// Monitor for new icons
iconManager.observe();

// Get performance metrics
const metrics = iconManager.getPerformance();
console.log('Icons processed:', metrics.iconsProcessed);
console.log('Average time:', metrics.averageTime);
```

### 8. SVG Sprite (Traditional)

```html
<!-- Include the sprite -->
<div style="display: none;">
  <div id="sva-icons-sprite">[SVG sprite content]</div>
</div>

<!-- Use icons -->
<svg width="24" height="24">
  <use href="#car"></use>
</svg>
<svg width="32" height="32">
  <use href="#battery"></use>
</svg>
```

---

## Import Patterns

### Function-Based (v2.1)
```javascript
// Individual imports (recommended for tree-shaking)
import { Plus, Minus, Settings } from 'sva-icons';

// Namespace import
import * as SvaIcons from 'sva-icons';
const iconHtml = SvaIcons.Plus({ size: 24 });

// CommonJS support
const { Plus, Minus } = require('sva-icons');

// All icons collection
import { allIcons } from 'sva-icons';
const iconHtml = allIcons.Plus({ size: 24 });
```

### Legacy Individual Imports
```javascript
// ESM Import (Tree-shakable)
import alertIcon from 'sva-icons/dist/icons/esm/alert.js';
document.body.innerHTML = alertIcon;

// CommonJS Import
const alertIcon = require('sva-icons/dist/icons/cjs/alert.js');
document.body.innerHTML = alertIcon;

// All Icons Map
const icons = require('sva-icons/dist/icons/index.js');
document.body.innerHTML = icons['alert'];
```

---

## Accessibility Guidelines

### Screen Reader Support
```javascript
// Add proper accessibility attributes
const icon = Plus({
  title: 'Add new item',
  'aria-label': 'Add item to cart',
  'aria-hidden': false,  // Make visible to screen readers
  focusable: true,       // Allow keyboard focus
  role: 'img'           // Define as image
});
```

### Color and Contrast
```css
/* Ensure proper contrast ratios */
.icon-primary {
  color: #0066cc; /* 4.5:1 contrast ratio minimum */
}

/* Support high contrast mode */
@media (prefers-contrast: high) {
  .icon-primary {
    color: #000000;
  }
}

/* Support reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sva-icon-animated {
    transition: none;
  }
  .sva-icon-spinning {
    animation: none;
  }
}
```

### Focus Management
```css
/* Keyboard focus indicators */
.focusable-icon:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

---

## Performance Optimization

### Bundle Analysis
```javascript
import { BundleAnalyzer } from 'sva-icons/analyzer';

// Analyze your icon usage
const report = BundleAnalyzer.analyze();
console.log('Bundle size:', report.totalSize);
console.log('Unused icons:', report.unusedIcons);
console.log('Recommendations:', report.recommendations);
```

### Lazy Loading
```javascript
// Load icons on demand
async function loadIcon(name) {
  const { [name]: icon } = await import(`sva-icons/dist/icons/esm/${name}.js`);
  return icon;
}

// Usage
const plusIcon = await loadIcon('plus');
document.getElementById('button').innerHTML = plusIcon({ size: 20 });
```

---

## Migration Guide

### From v2.0 to v2.1
```javascript
// Before (v2.0) - static SVG strings
import plus from 'sva-icons/dist/icons/esm/plus.js';
console.log(plus); // Static SVG string

// After (v2.1) - configurable functions  
import { Plus } from 'sva-icons';
console.log(Plus()); // Function that returns SVG string
console.log(Plus({ size: 32, color: 'blue' })); // Configurable output
```

### From CSS Pseudo-elements
```scss
// Before - Complex CSS
.btn--hotspot {
  &::before {
    background-image: use-svg($plus-icon, $plus-light-color);
  }
  
  [data-theme="dark"] &::before {
    background-image: use-svg($plus-icon, $plus-dark-color);
  }
}

// After - Simple & Theme-aware
.btn--hotspot {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .btn__icon {
    width: 20px;
    height: 20px;
    fill: currentColor; // Automatic theme support!
  }
}
```

---

## Directory Structure

```
dist/
├── icons/
│   ├── esm/           # ESM icon exports (individual files)
│   ├── cjs/           # CommonJS icon exports  
│   └── index.js       # All icons as JS object
├── react/
│   ├── esm/           # React components (ESM)
│   └── cjs/           # React components (CJS)
├── bundles/           # Smart bundles
├── class-based/       # Class-based API
├── web-components/    # Web components
├── sprite/            # SVG sprite
└── theme/             # CSS theme system
```

---

## Support & Resources

- **GitHub**: [Issues & Discussions](https://github.com/nissan/sva-icons/issues)
- **Documentation**: [Complete README](./README.md)
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Developer Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Icon Explorer**: [Interactive browser](./docs/)

---

**Made with ❤️ by Nissan Motor Corporation**

---

### 10. Example: Dynamic Icon Rendering

```js
import alertIcon from 'sva-icons/dist/icons/esm/alert.js';
document.getElementById('icon').innerHTML = alertIcon;
```

---

### 11. Advanced: Custom Icon Map (Tree-shaking)

```js
import { createIcons } from 'sva-icons';
import alertIcon from 'sva-icons/dist/icons/esm/alert.js';
import carIcon from 'sva-icons/dist/icons/esm/car.js';

createIcons({
  icons: {
    alert: alertIcon,
    car: carIcon
  },
  nameAttr: 'data-sva-icon',
  attrs: { class: 'my-icon', 'stroke-width': 2 }
});
```

---

### 12. React Usage

If you have generated React components (see project plan), usage will look like:

```jsx
import { Alert, Car } from 'sva-icons/react';

function App() {
  return (
    <>
      <Alert color="red" size={32} aria-label="Alert" />
      <Car color="#e11d48" size={40} />
    </>
  );
}
```

- All icon components accept `color`, `size`, `className`, `style`, and accessibility props.
- Tree-shakable: only import the icons you use.

---

### 13. Framework Integration Summary

SVA Icons supports multiple integration patterns:

**React Components:**
```jsx
import { Alert, Car } from 'sva-icons/react';

function App() {
  return (
    <div>
      <Alert color="red" size={32} />
      <Car color="#e11d48" size={40} />
    </div>
  );
}
```

**Web Components:**
```html
<sva-icon name="alert" color="red" size="32"></sva-icon>
<sva-icon name="car" color="#e11d48" size="40"></sva-icon>
```

**JavaScript with createIcons:**
```javascript
import { createIcons } from 'sva-icons/create-icons';
import alert from 'sva-icons/dist/icons/esm/alert.js';
import car from 'sva-icons/dist/icons/esm/car.js';

createIcons({ icons: { alert, car } });
```

- All icon components accept `color`, `size`, `class`, `style`, and accessibility props.
- Tree-shakable: only import the icons you use.

---

For more, see the project README or the demo files in `dist/web-components/`.
