# SVA Icons v2.0

A modern, enterprise-ready icon system designed for automotive and general UI applications. Features smart bundles, enhanced React components, comprehensive theming, and advanced developer tools.

## ✨ What's New in v2.0

- 🎯 **Smart Bundle System** - Optimized icon bundles reducing bundle size by 50-70%
- ⚛️ **Enhanced React Icon Component** - Unified component with theme, size, and variant support
- 🎨 **CSS Theme System** - Complete theming framework with predefined sizes, colors, and animations
- ⚙️ **JavaScript Theme API** - Programmatic theme configuration and runtime customization
- 🔍 **Bundle Analyzer** - Analyze and optimize icon usage with built-in tools
- 🛠️ **Developer Tools** - Enhanced debugging, validation, and development utilities
- 📦 **Improved Exports** - Better tree-shaking and module resolution
- 🔄 **Full Backward Compatibility** - Seamless upgrade from v1.x

## 🚀 Quick Start

### Enhanced React Components (v2.0)

```jsx
import { Icon } from 'sva-icons/react'

function MyComponent() {
  return (
    <div>
      {/* Theme-aware sizing */}
      <Icon name="alert" size="lg" theme="primary" />
      <Icon name="car" size="xl" variant="outline" />
      
      {/* Individual components still available */}
      <Alert size={24} color="red" />
    </div>
  )
}
```

### Smart Bundles (v2.0)

```javascript
// Import only what you need for optimal performance
import { automotiveCore } from 'sva-icons/bundles'
import { uiEssentials } from 'sva-icons/bundles'

// 50-70% smaller bundle sizes
const carIcon = automotiveCore.car
const homeIcon = uiEssentials.home
```

### CSS Theme System (v2.0)

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

## 📊 Platform Support & Bundle Sizes

| Platform | Package | Bundle Size | Tree-Shakable |
|----------|---------|-------------|---------------|
| **Button Integration** | `sva-icons/create-icons` | **2KB + 0.5KB/icon** | ✅ Yes |
| **React Components** | `sva-icons/react` | **2KB + 0.5KB/icon** | ✅ Yes |
| **Web Components (Registry)** | `sva-icons/web-components/tree-shakable` | **3KB + 0.5KB/icon** | ✅ Yes |
| **Web Components (Embedded)** | `sva-icons/web-components` | **100KB+** | ❌ No |
| **ESM Modules** | `sva-icons` | **2KB + 0.5KB/icon** | ✅ Yes |
| **SVG Sprite** | `sva-icons/sprite` | **50KB** | ❌ No |

## 🔧 Advanced Usage

### Theme-Aware Icons
```javascript
import { createThemeAwareIcons } from 'sva-icons/create-icons';

createThemeAwareIcons({
  icons: { plus, minus },
  themeColors: {
    light: { default: '#333333' },
    dark: { default: '#ffffff' }
  }
});
```

### Dynamic Icon Loading
```javascript
import { createIconsAsync } from 'sva-icons/create-icons';

// Automatically loads icons as needed
createIconsAsync({
  autoLoad: true,
  basePath: '/node_modules/sva-icons/dist/icons/esm/'
});
```

### React Hook Integration
```jsx
import { useSvaIcons } from './hooks/useSvaIcons';

function MyComponent() {
  useSvaIcons(); // Initializes icons when component mounts
  
  return (
    <button className="sva-c-button sva-c-button--hotspot">
      <i data-sva-icon="plus" className="sva-c-button__icon" />
      Add Item
    </button>
  );
}
```

## 🔍 Icon Explorer

Browse all available icons and copy usage examples:

👀 **[View Icon Explorer](./docs/)** - Interactive icon browser with search and copy-to-clipboard

## 📚 Documentation

- **[Framework Integration Guide](./.test/FRAMEWORK_INTEGRATION_GUIDE.md)** - Complete migration guide from CSS pseudo-elements
- **[Usage Examples](./USAGE.md)** - Platform-specific usage examples
- **[API Reference](#api-reference)** - Complete API documentation

## 🛠️ API Reference

### createIcons Utility

The main utility for button integration and icon replacement:

```typescript
interface CreateIconsOptions {
  icons: Record<string, string>;           // Icon name to SVG string mapping
  nameAttr?: string;                       // Attribute to search for (default: 'data-sva-icon')
  attrs?: Record<string, string>;          // Additional SVG attributes
  classPrefix?: string;                    // CSS class prefix (default: 'sva-icon')
  replaceOnly?: boolean;                   // Only replace, don't add classes
}

// Main function
createIcons(options: CreateIconsOptions): void;

// Async version with auto-loading
createIconsAsync(options: CreateIconsOptions & {
  autoLoad?: boolean;
  basePath?: string;
}): Promise<void>;

// Theme-aware version
createThemeAwareIcons(options: CreateIconsOptions & {
  themeAttribute?: string;
  themeColors?: Record<string, { default: string }>;
}): void;
```

### React Components

All React components accept these props:

```typescript
interface IconProps {
  size?: number | string;          // Default: 24
  color?: string;                  // Default: "currentColor"
  className?: string;
  style?: React.CSSProperties;
  // ...other SVG attributes
}
```

### Web Components

The `<sva-icon>` web component accepts these attributes:

- `name`: Icon name (required)
- `size`: Icon size in pixels or CSS value (default: "24")
- `color`: Icon color (default: "currentColor")

Tree-shakable web components with registry:

```typescript
class SvaIconRegistry {
  static register(iconName: string, svgContent: string): void;
  static registerMultiple(icons: Record<string, string>): void;
  static get(iconName: string): string | undefined;
  static has(iconName: string): boolean;
}
```

### Icon Names

All icons use kebab-case naming:
- `car` → `<Car />` (React) or `<sva-icon name="car">` (Web Component)
- `battery-status` → `<BatteryStatus />` (React) or `<sva-icon name="battery-status">` (Web Component)
- `air-conditioning` → `<AirConditioning />` (React) or `<sva-icon name="air-conditioning">` (Web Component)

## 🏗️ Building from Source

```bash
# Install dependencies
npm install

# Build all platforms
npm run build:all

# Individual builds
npm run build:react          # React components
npm run build:icons          # ESM/CJS modules  
npm run build:sprite         # SVG sprite
npm run build:web            # Web components
npm run build:create-icons   # createIcons utility

# Start documentation site
cd docs && npm run dev
```

## 🤝 Contributing

1. Add new SVG files to the `svg/` directory
2. Update `icons.json` with metadata and tags
3. Run `npm run build:all` to generate all platform outputs
4. Test in the documentation site

## 📁 File Structure

```
sva-icons/
├── svg/                     # Source SVG files
├── dist/
│   ├── react/               # React components
│   ├── icons/               # ESM/CJS modules + createIcons utility
│   ├── sprite/              # SVG sprite
│   └── web-components/      # Web components (embedded + tree-shakable)
├── .test/                   # Test files and integration guides
├── docs/                    # Documentation site
├── scripts/                 # Build scripts
├── icons.json               # Icon metadata
├── USAGE.md                 # Usage examples
└── package.json
```

## 🆚 Comparison with Other Libraries

| Feature | SVA Icons | Lucide | Heroicons | Tabler |
|---------|-----------|--------|-----------|--------|
| **Tree-shakable** | ✅ All platforms | ✅ React only | ✅ React only | ✅ React only |
| **Button Integration** | ✅ Built-in utility | ❌ Manual | ❌ Manual | ❌ Manual |
| **Theme Support** | ✅ Automatic | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual |
| **Web Components** | ✅ Tree-shakable | ❌ No | ❌ No | ❌ No |
| **Automotive Icons** | ✅ Specialized | ❌ General | ❌ General | ❌ General |
| **Bundle Size** | **2KB + 0.5KB/icon** | 3KB + 1KB/icon | 2KB + 0.8KB/icon | 3KB + 0.7KB/icon |

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Tabler Icons](https://tabler-icons.io/) - Over 4000 free SVG icons

---

**Made with ❤️ by Nissan Motor Corporation**

*For support, questions, or feature requests, please [open an issue](https://github.com/nissan/sva-icons/issues).*
