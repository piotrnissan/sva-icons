# SVA Icons v2.1 - Quick Start Guide

## 🚀 Installation

```bash
npm install sva-icons@^2.1.0
```

## ✨ What's New in v2.1

- 🎯 **Function-Based Icons** - Icons are now configurable functions
- ⚡ **Props Support** - Dynamic sizing, colors, classes, accessibility
- 📦 **Enhanced Framework Integration** - Better React, Vue, Angular support
- 🔄 **Backward Compatible** - Seamless upgrade from v2.0

## 🎯 Choose Your Integration Method

### 1. Function-Based Icons (v2.1 NEW!) ⭐

**Modern, configurable approach:**

```javascript
import { Plus, Minus, Car } from 'sva-icons';

// Basic usage - returns SVG string
const iconHtml = Plus();

// Configurable with props
const customIcon = Plus({
  size: 32,
  color: 'blue',
  className: 'my-icon',
  title: 'Add Item'
});

// Use in HTML
document.getElementById('button').innerHTML = customIcon;
```

**Bundle size**: ~2KB + ~0.8KB per icon

### 2. Button Migration (Great for existing designs)

**Perfect for upgrading from CSS `::before` pseudo-elements:**

```html
<!-- Replace this -->
<button class="btn btn--plus">Add Item</button>

<!-- With this -->
<button class="btn btn--hotspot">
  <i data-sva-icon="plus" class="btn__icon"></i>
  Add Item
</button>
```

```javascript
import { createIcons } from 'sva-icons/create-icons';
import plus from 'sva-icons/dist/icons/esm/plus.js';

createIcons({ icons: { plus } }); // Only 2.5KB total!
```

**Bundle size**: 2KB + 0.5KB per icon

### 3. React Components

```jsx
import { Plus, Minus, Car } from 'sva-icons/react';

function App() {
  return (
    <button className="btn">
      <Plus size={20} />
      Add Item
    </button>
  );
}
```

**Bundle size**: 2KB + 0.5KB per icon

### 4. Framework Integration Examples

#### React with Function-Based Icons
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

### 5. Web Components (Tree-shakable)

```html
<script type="module">
import { SvaIconRegistry } from 'sva-icons/web-components/tree-shakable';
import plus from 'sva-icons/dist/icons/esm/plus.js';

SvaIconRegistry.register('plus', plus);
</script>

<sva-button variant="hotspot" icon="plus">Add Item</sva-button>
```

**Bundle size**: 3KB + 0.5KB per icon

### 6. Smart Bundles (v2.1)

```javascript
// Import specific bundles for smaller sizes
import { automotiveCore } from 'sva-icons/bundles';
import { uiEssentials } from 'sva-icons/bundles';

// Use bundle icons (function-based)
const carIcon = automotiveCore.car({ size: 24, color: 'blue' });
const homeIcon = uiEssentials.home({ size: 20 });
```

**Available Bundles:**
- `automotive-core` - Car, battery, charging, etc.
- `ui-essentials` - Home, search, user, etc.
- `navigation` - Arrows, maps, directions

## 🔧 Props Configuration (v2.1)

All function-based icons support these props:

```javascript
import { Plus } from 'sva-icons';

const icon = Plus({
  size: 32,                    // Size in pixels or CSS units
  color: 'blue',              // Any CSS color value
  className: 'my-icon',       // CSS classes
  strokeWidth: 2,             // Stroke width for outline icons
  title: 'Add Item',          // Accessibility title
  'aria-label': 'Add item',   // ARIA label
  'data-testid': 'add-btn'    // Custom attributes
});
```

## 📖 Documentation

- **[Complete README](./README.md)** - Full feature overview and migration guide
- **[Usage Guide](./USAGE.md)** - Detailed usage patterns for all methods
- **[Quick Reference](./QUICK_REFERENCE.md)** - Developer daily usage guide
- **[Icon Explorer](./docs/)** - Browse all 358 icons interactively

## 🆚 Bundle Size Comparison

| Method | Base | Per Icon | 10 Icons | Best For |
|--------|------|----------|----------|----------|
| **Function-based (v2.1)** | 2KB | 0.8KB | **10KB** | Modern apps |
| **createIcons** | 2KB | 0.5KB | **7KB** | Existing designs |
| **React Components** | 2KB | 0.5KB | **7KB** | React apps |
| **Smart Bundles** | 1KB | 0.3KB | **4KB** | Themed sets |
| Web Components (Tree-shakable) | 3KB | 0.5KB | 8KB | Any framework |
| SVG Sprite | 50KB | 0KB | 50KB | Legacy |

## 🎨 Theme Support

All methods automatically support themes via `currentColor`:

```scss
.btn--hotspot {
  color: var(--primary-color); // Icons inherit this color
  
  [data-theme="dark"] & {
    color: var(--primary-color-dark); // Automatic theme switching
  }
}
```

## 📞 Support

- **GitHub**: [Issues & Discussions](https://github.com/nissan/sva-icons/issues)  
- **Docs**: [Integration Examples](./.test/INTEGRATION_EXAMPLES.md)  
- **Migration**: [Step-by-step guide](./.test/FRAMEWORK_INTEGRATION_GUIDE.md)

---

**Made with ❤️ by Nissan Motor Corporation**
