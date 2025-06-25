// Basic Web Component for SVA Icons
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

  async render() {
    const name = this.getAttribute('name');
    // Support CSS variable for color
    let color = this.getAttribute('color') || 'currentColor';
    if (color.startsWith('var(')) {
      // Use the computed style for the variable
      const computed = getComputedStyle(this).getPropertyValue(color.slice(4, -1).trim());
      if (computed) color = computed.trim() || color;
    }
    let size = this.getAttribute('size') || '24';
    if (size.startsWith('var(')) {
      const computed = getComputedStyle(this).getPropertyValue(size.slice(4, -1).trim());
      if (computed) size = computed.trim() || size;
    }
    // Accept both '24' and '24px' for size
    let sizeValue = size.match(/^\d+$/) ? `${size}px` : size;
    if (!name) {
      this.shadowRoot.innerHTML = '<span>Icon name missing</span>';
      return;
    }
    // Dynamically import SVG content (to be implemented)
    let svg = await this.fetchSvg(name);
    if (svg) {
      // Ensure all <path> elements have the correct fill
      svg = svg.replace(/<path(?![^>]*fill=)/g, `<path fill=\"${color}\"`);
      // Replace any existing fill attributes
      svg = svg.replace(/fill=\"[^\"]*\"/g, `fill=\"${color}\"`);
      this.shadowRoot.innerHTML = `
        <span style="display:inline-block;width:${sizeValue};height:${sizeValue};vertical-align:middle;">
          ${svg}
        </span>
      `;
    } else {
      this.shadowRoot.innerHTML = `<span>Icon not found: ${name}</span>`;
    }
  }

  async fetchSvg(name) {
    // Placeholder: In production, use a better loader or bundle SVGs
    try {
      const resp = await fetch(`../svg/${name}.svg`);
      if (!resp.ok) return null;
      return await resp.text();
    } catch (e) {
      return null;
    }
  }
}

customElements.define('sva-icon', SvaIcon);
export { SvaIcon };
