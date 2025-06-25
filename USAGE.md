# SVA Icons: Usage Guide

A modern, multi-platform icon system for SVA icons. Supports React, Web Components, ESM, CJS, CDN, and more.

---

## Installation

### Package Managers

```sh
npm install sva-icons
# or
yarn add sva-icons
# or
pnpm add sva-icons
```

### CDN

```html
<!-- Development version -->
<script src="https://unpkg.com/sva-icons@latest/dist/web-components/sva-icon.umd.js"></script>
```

---

## Usage

### 1. Web Component (Recommended)

```html
<sva-icon name="alert" color="red" size="32" aria-label="Alert"></sva-icon>

<!-- With CSS variables -->
<style>
  :root { --sva-icon-color: #e11d48; --sva-icon-size: 40px; }
</style>
<sva-icon name="alert" color="var(--sva-icon-color)" size="var(--sva-icon-size)" aria-label="Alert"></sva-icon>
```

#### Accessibility
- Use `aria-label` or `title` for screen readers.
- The icon is rendered as an inline SVG for best accessibility.

#### Theming & Sizing
- Use the `color` and `size` attributes, or CSS variables, for easy theming.
- Supports both numbers (pixels) and CSS units (e.g., `24px`, `2em`).

---

### 2. ESM Import (Tree-shakable)

```js
import alertIcon from 'sva-icons/dist/icons/esm/alert.js';
document.body.innerHTML = alertIcon;
```

### 3. CommonJS Import

```js
const alertIcon = require('sva-icons/dist/icons/cjs/alert.js');
document.body.innerHTML = alertIcon;
```

### 4. Vanilla JS: All Icons Map

```js
const icons = require('sva-icons/dist/icons/index.js');
document.body.innerHTML = icons['alert'];
```

---

### 5. Dynamic Icon Rendering (like Lucide)

You can use a helper to replace `<i data-sva-icon="alert"></i>` with SVGs:

```js
import icons from 'sva-icons/dist/icons/index.js';
function createIcons() {
  document.querySelectorAll('[data-sva-icon]').forEach(el => {
    const name = el.getAttribute('data-sva-icon');
    if (icons[name]) el.outerHTML = icons[name];
  });
}
createIcons();
```

---

### 6. Advanced: Custom Element Binding

```js
import alertIcon from 'sva-icons/dist/icons/esm/alert.js';
const div = document.createElement('div');
div.innerHTML = alertIcon;
document.body.appendChild(div);
```

---

### 7. Customization & Theming
- Change color/size via attributes or CSS variables.
- Add custom classes or inline styles to the SVG string if needed.
- For global styling, target the `sva-icon` element or SVGs inside it.

---

### 8. Accessibility
- Add `aria-label`, `role="img"`, or `title` for screen readers.
- Example:
  ```html
  <sva-icon name="alert" aria-label="Alert icon" role="img"></sva-icon>
  ```

---

### 9. Directory Structure
- `dist/web-components/` — Bundled web component and demo
- `dist/icons/esm/` — ESM icon exports
- `dist/icons/cjs/` — CommonJS icon exports
- `dist/icons/index.js` — All icons as a JS object
- `dist/sva-icons/` — Raw SVGs for direct use

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

### 13. Vue Usage

If you have generated Vue components:

```js
// main.js
import { Alert, Car } from 'sva-icons/vue';

export default {
  components: { Alert, Car }
}
```

```html
<template>
  <Alert color="red" :size="32" aria-label="Alert" />
  <Car color="#e11d48" :size="40" />
</template>
```

- All icon components accept `color`, `size`, `class`, `style`, and accessibility props.
- Tree-shakable: only import the icons you use.

---

For more, see the project README or the demo files in `dist/web-components/`.
