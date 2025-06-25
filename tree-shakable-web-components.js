// Tree-Shakable Web Component with Icon Registry
class SvaIconRegistry {
  static icons = new Map();
  
  static register(iconName, svgContent) {
    this.icons.set(iconName, svgContent);
  }
  
  static registerMultiple(iconMap) {
    Object.entries(iconMap).forEach(([name, svg]) => {
      this.register(name, svg);
    });
  }
  
  static get(iconName) {
    return this.icons.get(iconName);
  }
  
  static has(iconName) {
    return this.icons.has(iconName);
  }
}

// Tree-shakable SVA Icon Web Component
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
    
    const sizeValue = size.match(/^\d+$/) ? `${size}px` : size;
    
    if (!name) {
      this.shadowRoot.innerHTML = '<span>Icon name missing</span>';
      return;
    }
    
    // Get icon from registry (tree-shakable)
    const svgContent = SvaIconRegistry.get(name);
    if (svgContent) {
      let svg = svgContent;
      
      // Set the size on the SVG element
      svg = svg.replace(/<svg/, `<svg width="${sizeValue}" height="${sizeValue}"`);
      
      // Apply color to paths that don't have fill attributes
      svg = svg.replace(/<path(?![^>]*fill=)/g, `<path fill="${color}"`);
      
      // Replace existing fill attributes (except 'none')
      svg = svg.replace(/fill="(?!none)[^"]*"/g, `fill="${color}"`);
      
      this.shadowRoot.innerHTML = `
        <span style="display:inline-block;vertical-align:middle;line-height:0;">
          ${svg}
        </span>
      `;
    } else {
      this.shadowRoot.innerHTML = `<span>Icon not found: ${name}</span>`;
    }
  }
}

// Tree-shakable Button Web Component
class SvaButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'icon', 'theme', 'disabled'];
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
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'regular';
    const icon = this.getAttribute('icon');
    const theme = this.getAttribute('theme') || 'light';
    const disabled = this.hasAttribute('disabled');

    const baseClass = 'sva-c-button';
    const classes = [
      baseClass,
      `${baseClass}--${variant}`,
      size !== 'regular' && `${baseClass}--${size}`,
      disabled && `${baseClass}--disabled`
    ].filter(Boolean).join(' ');

    const iconSize = size === 'small' ? '16' : '20';
    
    this.shadowRoot.innerHTML = `
      <style>
        @import url('./path/to/your/button-styles.css');
      </style>
      <button class="${classes}" data-theme="${theme}" ${disabled ? 'disabled' : ''}>
        ${icon ? `<sva-icon name="${icon}" size="${iconSize}" class="sva-c-button__icon"></sva-icon>` : ''}
        <slot></slot>
      </button>
    `;
  }
}

// Register components
customElements.define('sva-icon', SvaIcon);
customElements.define('sva-button', SvaButton);

export { SvaIcon, SvaButton, SvaIconRegistry };
