# SVA Icons

A modern, multi-platform icon system for SVA icons. Supports React components, Web Components, ESM/CJS modules, and SVG sprites.

## 📖 Documentation

**[View Full Documentation & Icon Explorer →](https://sva-icons.vercel.app)**

Interactive documentation with live examples, searchable icon gallery, and complete API reference.

## Features

- 🎨 **358 carefully crafted icons**
- ⚛️ **React components** with TypeScript support
- 🔧 **Web Components** for any framework
- 📦 **ESM/CJS modules** for vanilla JavaScript
- 🖼️ **SVG sprite** for traditional HTML/CSS usage
- 🔍 **Searchable and taggable** icon explorer
- 🎯 **Tree-shakable** and optimized for performance
- 📱 **Responsive** and accessible by default

## Installation

```bash
npm install sva-icons
```

Or via CDN:

```html
<!-- Web Components -->
<script src="https://unpkg.com/sva-icons/dist/web-components/sva-icon.js"></script>

<!-- SVG Sprite -->
<link rel="preload" href="https://unpkg.com/sva-icons/dist/sprite/sva-icons-sprite.svg" as="image">
```

## Quick Start

### React

```jsx
import { Car, Battery, Navigation } from 'sva-icons/react';

function App() {
  return (
    <div>
      <Car size={24} color="blue" />
      <Battery size={32} color="green" />
      <Navigation size={20} />
    </div>
  );
}
```

### Web Components

```html
<sva-icon name="car" size="24" color="blue"></sva-icon>
<sva-icon name="battery" size="32" color="green"></sva-icon>
<sva-icon name="navigation" size="20"></sva-icon>
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

## Platform Support

| Platform | Package | Import |
|----------|---------|--------|
| React | `sva-icons/react` | `import { IconName } from 'sva-icons/react'` |
| Web Components | `sva-icons/web-components` | `<sva-icon name="icon-name">` |
| ESM | `sva-icons` | `import { iconName } from 'sva-icons'` |
| CommonJS | `sva-icons` | `const { iconName } = require('sva-icons')` |
| SVG Sprite | `sva-icons/sprite` | `<use href="#icon-name">` |

## Icon Explorer

Browse all available icons and copy usage examples:

👀 **[View Icon Explorer](./docs/)** - Interactive icon browser with search and copy-to-clipboard

## API Reference

### React Components

All React components accept these props:

```typescript
interface IconProps {
  size?: number | string;  // Default: 24
  color?: string;          // Default: "currentColor"
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

### Icon Names

All icons use kebab-case naming:
- `car` → `<Car />` (React) or `<sva-icon name="car">` (Web Component)
- `battery-status` → `<BatteryStatus />` (React) or `<sva-icon name="battery-status">` (Web Component)
- `air-conditioning` → `<AirConditioning />` (React) or `<sva-icon name="air-conditioning">` (Web Component)

## Building from Source

```bash
# Install dependencies
npm install

# Build all platforms
npm run build:all

# Individual builds
npm run build:react      # React components
npm run build:icons      # ESM/CJS modules  
npm run build:sprite     # SVG sprite
npm run build:web        # Web components

# Start documentation site
cd docs && npm run dev
```

## Contributing

1. Add new SVG files to the `sva-icons/` directory
2. Update `icons.json` with metadata and tags
3. Run `npm run build:all` to generate all platform outputs
4. Test in the documentation site

## File Structure

```
sva-icons/
├── sva-icons/           # Source SVG files
├── dist/
│   ├── react/           # React components
│   ├── icons/           # ESM/CJS modules
│   ├── sprite/          # SVG sprite
│   └── web-components/  # Web components
├── docs/                # Documentation site
├── icons.json           # Icon metadata
└── package.json
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Tabler Icons](https://tabler-icons.io/) - Over 4000 free SVG icons

---

**Made with ❤️ by Nissan Motor Corporation**
