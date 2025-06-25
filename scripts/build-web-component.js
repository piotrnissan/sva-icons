// build-web-component.js: Generate a web component with embedded SVG data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const iconsDir = path.join(projectRoot, 'svg');
const outputFile = path.join(projectRoot, 'web-components', 'sva-icon-embedded.js');

// Read all SVG files and create a map
const icons = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));
const iconMap = {};

icons.forEach(file => {
  const name = path.basename(file, '.svg');
  const svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf8');
  iconMap[name] = svgContent;
});

// Generate the web component with embedded SVG data
const componentCode = `
// SVA Icon Web Component with embedded SVG data
const ICON_DATA = ${JSON.stringify(iconMap, null, 2)};

class SvaIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'color', 'size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute('name');
    let color = this.getAttribute('color') || 'currentColor';
    let size = this.getAttribute('size') || '24';
    
    // Support CSS variables
    if (color.startsWith('var(')) {
      const computed = getComputedStyle(this).getPropertyValue(color.slice(4, -1).trim());
      if (computed) color = computed.trim() || color;
    }
    
    if (size.startsWith('var(')) {
      const computed = getComputedStyle(this).getPropertyValue(size.slice(4, -1).trim());
      if (computed) size = computed.trim() || size;
    }
    
    // Accept both '24' and '24px' for size
    const sizeValue = size.match(/^\\d+$/) ? \`\${size}px\` : size;
    
    if (!name) {
      this.shadowRoot.innerHTML = '<span>Icon name missing</span>';
      return;
    }
    
    const svgContent = ICON_DATA[name];
    if (svgContent) {
      // Apply color and size to the SVG
      let svg = svgContent;
      
      // Set the size on the SVG element
      svg = svg.replace(/<svg/, \`<svg width="\${sizeValue}" height="\${sizeValue}"\`);
      
      // Apply color to paths that don't have fill attributes
      svg = svg.replace(/<path(?![^>]*fill=)/g, \`<path fill="\${color}"\`);
      
      // Replace existing fill attributes (except 'none')
      svg = svg.replace(/fill="(?!none)[^"]*"/g, \`fill="\${color}"\`);
      
      this.shadowRoot.innerHTML = \`
        <span style="display:inline-block;vertical-align:middle;line-height:0;">
          \${svg}
        </span>
      \`;
    } else {
      this.shadowRoot.innerHTML = \`<span>Icon not found: \${name}</span>\`;
    }
  }
}

customElements.define('sva-icon', SvaIcon);
export { SvaIcon };
`;

// Write the component file
fs.writeFileSync(outputFile, componentCode);
console.log(`✅ Generated web component with embedded SVGs: ${outputFile}`);
console.log(`📊 Embedded ${icons.length} icons`);
