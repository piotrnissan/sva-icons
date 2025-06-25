# SVA Icons - Quick Start Guide

## 🚀 Installation

```bash
npm install sva-icons
```

## 🎯 Choose Your Integration Method

### 1. Button Migration (Recommended for existing designs)

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

### 2. React Components

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

### 3. Web Components (Tree-shakable)

```html
<script type="module">
import { SvaIconRegistry } from 'sva-icons/web-components/tree-shakable';
import plus from 'sva-icons/dist/icons/esm/plus.js';

SvaIconRegistry.register('plus', plus);
</script>

<sva-button variant="hotspot" icon="plus">Add Item</sva-button>
```

**Bundle size**: 3KB + 0.5KB per icon

## 📖 Documentation

- **[Complete README](./README.md)** - Full feature overview
- **[Framework Integration Guide](./.test/FRAMEWORK_INTEGRATION_GUIDE.md)** - Migration from CSS pseudo-elements
- **[Integration Examples](./.test/INTEGRATION_EXAMPLES.md)** - React, Vue, Angular examples
- **[Icon Explorer](./docs/)** - Browse all 358 icons

## 🆚 Bundle Size Comparison

| Method | Base | Per Icon | 10 Icons |
|--------|------|----------|----------|
| **createIcons** | 2KB | 0.5KB | **7KB** |
| **React** | 2KB | 0.5KB | **7KB** |
| **Web Components (Tree-shakable)** | 3KB | 0.5KB | **8KB** |
| SVG Sprite | 50KB | 0KB | 50KB |
| Web Components (All icons) | 100KB+ | 0KB | 100KB+ |

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
