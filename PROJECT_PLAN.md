# SVA Icons Lucide-like System: Project Plan & Tracker

## Vision
Create a modern, multi-platform icon system (like Lucide) for the SVA icon set, supporting React, Web Components, HTML, CSS, and easy search/tagging.

---

## Milestones & Tasks

### 1. Icon Source & Optimization
- [x] Store all SVGs in a single folder (`sva-icons/`)
- [x] Optimize SVGs with SVGO
- [x] Maintain `icons.json` manifest with tags/metadata

### 2. React Component Generation
- [ ] Set up SVGR to convert SVGs to React components
- [ ] Output to `/react` folder with index export
- [ ] Add props for color, size, etc.
- [ ] Add build script to automate

### 3. Web Component System
- [ ] Create `<sva-icon name="icon-name">` custom element
- [ ] Dynamically load SVGs by name
- [ ] Support color/size via attributes
- [ ] Add build script to automate

### 4. ESM/CJS/Vanilla JS Exports
- [ ] Bundle all icons as ES modules and CommonJS
- [ ] Add index.js for vanilla JS import

### 5. CSS/HTML Usage
- [ ] Generate SVG sprite or inline SVGs
- [ ] Optionally, generate CSS classes for each icon

### 6. Tagging & Search
- [ ] Use `icons.json` to power a searchable/taggable explorer
- [ ] Build a simple docs/demo site (e.g., Storybook, Docusaurus, or custom)

### 7. Automation & Distribution
- [ ] Add npm scripts for all build steps
- [ ] Prepare for npm publishing (package.json, README, etc.)
- [ ] Document usage for all platforms

---

## Project Tracker

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Optimize SVGs & manifest | Done |  |  |
| Generate React components | Todo |  |  |
| Generate Web Component | Todo |  |  |
| Bundle for JS/ESM | Todo |  |  |
| Generate CSS/Sprite | Todo |  |  |
| Build docs/demo site | Todo |  |  |
| Add npm scripts | Todo |  |  |
| Prepare npm package | Todo |  |  |
| Document usage | Todo |  |  |

---

## Next Steps
1. Set up React component generation with SVGR
2. Set up Web Component system
3. Plan bundling and documentation

---

*Update this tracker as you progress. Assign owners and add notes as needed.*
