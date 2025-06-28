# SVA Icons v2.1

A modern, enterprise-ready icon system designed for automotive and framework integration. Features function-based icons with configurable props, smart bundles, enhanced React components, and comprehensive framework support.

## ✨ What's New in v2.1

- 🎯 **Function-Based Icons** - Icons are now configurable functions that accept props
- 📦 **Framework Integration Ready** - Full compatibility with modern frameworks (React, Vue, Angular)
- ⚡ **Configurable Props** - Dynamic sizing, colors, classes, and accessibility features
- 🔧 **SVA Framework Integration** - Complete integration support for SVA design system
- � **Import Flexibility** - Multiple import patterns for optimal developer experience
- 🎨 **Enhanced Props Interface** - Support for size, color, className, strokeWidth, title, aria-* attributes
- � **Better Developer Experience** - Function signatures provide better IDE support and type safety
- 🔄 **Backward Compatible** - Seamless upgrade from v2.0 with maintained compatibility

## 🚀 Quick Start

### Function-Based Icons (v2.1 NEW!)

```javascript
import { Plus, Minus, Settings, Car } from 'sva-icons';

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

### Framework Integration Examples

#### React Integration
```jsx
import { Plus, Settings } from 'sva-icons';

function IconButton({ onClick }) {
  const iconHtml = Plus({ size: 20, color: 'currentColor' });
  
  return (
    <button onClick={onClick}>
      <span dangerouslySetInnerHTML={{ __html: iconHtml }} />
      Add Item
    </button>
  );
}
```

#### Vue Integration
```vue
<template>
  <button @click="handleClick">
    <span v-html="plusIcon"></span>
    Add Item
  </button>
</template>

<script>
import { Plus } from 'sva-icons';

export default {
  computed: {
    plusIcon() {
      return Plus({ size: 20, color: 'currentColor' });
    }
  }
}
</script>
```

### Import Patterns

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

```css
/* Import the theme system */
@import 'sva-icons/dist/sva-icons.css';

/* Use predefined classes */
.my-icon {
  @apply sva-icon-lg sva-icon-primary sva-icon-animated;
}
```

## ✨ Features

- 🎨 **358 carefully crafted icons** optimized for automotive and UI use
- 🎯 **Smart bundles** with 50-70% smaller bundle sizes  
- 🌳 **Fully tree-shakable** - only bundle the icons you use
- ⚛️ **Enhanced React components** with theme and variant support
- 🔧 **Web Components** for any framework
- 📦 **ESM/CJS modules** for vanilla JavaScript
- 🖼️ **SVG sprite** for traditional HTML/CSS usage
- 🎯 **Button integration utility** for existing designs
- 🎭 **Advanced theming** with CSS framework and JavaScript API
- 📱 **Responsive** and accessible by default
- 🔍 **Bundle analyzer** and developer tools
- 🔍 **Searchable icon explorer** with copy-to-clipboard

## 📦 Installation

```bash
npm install sva-icons@^2.0.0
```

Or via CDN:

```html
<!-- Web Components -->
<script src="https://unpkg.com/sva-icons@2/dist/web-components/sva-icon.js"></script>

<!-- CSS Theme System -->
<link rel="stylesheet" href="https://unpkg.com/sva-icons@2/dist/sva-icons.css">
```

### Button Integration (Recommended for existing designs)

Perfect for migrating from CSS `::before` pseudo-elements to HTML-based icons:

```html
<!-- HTML -->
<button class="sva-c-button sva-c-button--hotspot">
  <i data-sva-icon="plus" class="sva-c-button__icon"></i>
  Add Item
</button>

<button class="sva-c-button sva-c-button--hotspot sva-c-button--small">
  <i data-sva-icon="minus" class="sva-c-button__icon"></i>
  Remove Item
</button>
```

```javascript
// JavaScript - Tree-shakable: only import icons you need
import { createIcons } from 'sva-icons/create-icons';
import plus from 'sva-icons/dist/icons/esm/plus.js';
import minus from 'sva-icons/dist/icons/esm/minus.js';

// Initialize icons (replaces all data-sva-icon elements)
createIcons({
  icons: { plus, minus } // Only these icons will be bundled
});
```

**Bundle size**: ~2KB + ~0.5KB per icon (extremely lightweight!)

## 🎯 Smart Bundles (v2.0)

Optimized icon bundles for specific use cases, reducing bundle size by 50-70%:

```javascript
// Import specific bundles
import { automotiveCore } from 'sva-icons/bundles'
import { uiEssentials } from 'sva-icons/bundles'
import { statusIcons } from 'sva-icons/bundles'
import { controls } from 'sva-icons/bundles'
import { navigation } from 'sva-icons/bundles'

// Use bundle icons
const carIcon = automotiveCore.car
const alertIcon = automotiveCore.alert
const homeIcon = uiEssentials.home
const searchIcon = uiEssentials.search
```

**Available Bundles:**
- `automotive-core` - Essential automotive icons (alert, car, battery, etc.)
- `ui-essentials` - Common UI icons (home, search, user, etc.)
- `status-icons` - Status and notification icons
- `controls` - Control and action icons  
- `navigation` - Navigation and directional icons

## ⚛️ Enhanced React Components (v2.0)

```jsx
// Enhanced Icon component with theme support
import { Icon } from 'sva-icons/react'

function MyComponent() {
  return (
    <div>
      {/* Theme-aware sizing */}
      <Icon name="alert" size="sm" />      {/* 16px */}
      <Icon name="car" size="md" />        {/* 24px */}
      <Icon name="home" size="lg" />       {/* 32px */}
      <Icon name="user" size="xl" />       {/* 48px */}
      
      {/* Theme colors */}
      <Icon name="alert" theme="primary" />
      <Icon name="warning" theme="danger" />
      <Icon name="success" theme="success" />
      
      {/* Style variants */}
      <Icon name="heart" variant="outline" />
      <Icon name="star" variant="filled" />
      
      {/* Custom colors still supported */}
      <Icon name="custom" color="#ff6b6b" />
    </div>
  )
}

// Individual components still available
import { Car, Battery, Plus, Minus } from 'sva-icons/react';

function IconsExample() {
  return (
    <div>
      <Car size={24} color="blue" />
      <Battery size={32} color="green" />
    </div>
  );
}
```

## 🎨 CSS Theme System (v2.0)

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

## ⚙️ JavaScript Theme API (v2.0)

```javascript
import { SVATheme } from 'sva-icons/theme'

// Configure global theme
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
})

// Apply predefined themes
SVATheme.applyTheme('dark')
SVATheme.applyTheme('automotive')
SVATheme.applyTheme('minimal')
```

### Web Components

```html
<!-- Basic usage -->
<sva-icon name="car" size="24" color="blue"></sva-icon>
<sva-icon name="battery" size="32" color="green"></sva-icon>

<!-- Tree-shakable web components -->
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

### Vanilla JavaScript (ESM)

```javascript
import { car, battery, navigation } from 'sva-icons';

// Use the SVG strings directly
document.getElementById('car-icon').innerHTML = car;
document.getElementById('battery-icon').innerHTML = battery;
```

### SVG Sprite

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

## 🎯 Migration from CSS Pseudo-Elements

Perfect for upgrading existing button systems that use `::before` with background images:

### Before (Complex CSS)
```scss
.sva-c-button--hotspot {
  &::before {
    background-image: use-svg($plus-icon, $plus-light-color);
  }
  
  [data-theme="dark"] &::before {
    background-image: use-svg($plus-icon, $plus-dark-color);
  }
  
  &.sva-c-button--minus::before {
    background-image: use-svg($minus-icon, $minus-light-color);
  }
  // ... many more variants
}
```

### After (Simple & Theme-Aware)
```scss
.sva-c-button--hotspot {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .sva-c-button__icon {
    display: inline-flex;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid currentColor;
    
    .sva-icon {
      width: 20px;
      height: 20px;
      fill: currentColor; // Automatic theme support!
    }
  }
}
```

**See the [Framework Integration Guide](./.test/FRAMEWORK_INTEGRATION_GUIDE.md) for complete migration instructions.**

## 🔧 Props Interface (v2.1)

All SVA Icons now accept a comprehensive props object for customization:

```typescript
interface SvaIconProps {
  size?: number | string;        // Icon size (default: 24)
  color?: string;               // Icon color (default: 'currentColor')
  className?: string;           // CSS classes to apply
  strokeWidth?: number;         // Stroke width (default: 1.5)
  title?: string;              // Accessibility title
  focusable?: boolean;         // Whether icon is focusable (default: false)
  'aria-hidden'?: boolean;     // Hide from screen readers (default: true)
  'aria-label'?: string;       // Accessibility label
  [key: string]: any;          // Additional SVG attributes
}
```

### Props Examples

```javascript
import { Plus, Car, Settings } from 'sva-icons';

// Size variations
const smallIcon = Plus({ size: 16 });
const largeIcon = Plus({ size: 48 });
const responsiveIcon = Plus({ size: 'clamp(16px, 4vw, 32px)' });

// Color variations
const blueIcon = Plus({ color: 'blue' });
const primaryIcon = Plus({ color: 'var(--color-primary)' });
const currentIcon = Plus({ color: 'currentColor' }); // Default

// Styling and classes
const styledIcon = Plus({
  className: 'icon-button hover:scale-110 transition-transform',
  strokeWidth: 2
});

// Accessibility
const accessibleIcon = Plus({
  title: 'Add new item',
  'aria-label': 'Add item to cart',
  'aria-hidden': false,
  focusable: true
});

// Custom attributes
const customIcon = Plus({
  'data-testid': 'add-button-icon',
  'data-tooltip': 'Click to add'
});
```

## 🔄 Migration Guide: v2.0 → v2.1

### What Changed
- **Icons are now functions** instead of static SVG strings
- **Props support** added for dynamic configuration
- **Better framework integration** with configurable output
- **Maintained compatibility** - existing imports still work

### Before (v2.0)
```javascript
import plus from 'sva-icons/dist/icons/esm/plus.js';
console.log(plus); // Static SVG string
```

### After (v2.1)
```javascript
import { Plus } from 'sva-icons';
console.log(Plus()); // Function that returns SVG string
console.log(Plus({ size: 32, color: 'blue' })); // Configurable output
```

### Migration Steps
1. **No breaking changes** - existing code continues to work
2. **Gradual adoption** - migrate to function-based imports for new features
3. **Enhanced props** - leverage new configuration options where needed

### Framework Integration Benefits
- **React**: Better prop handling and re-rendering optimization
- **Vue**: Reactive prop binding for dynamic icons  
- **Angular**: Type-safe icon configuration
- **Any Framework**: Consistent API across all platforms
```
