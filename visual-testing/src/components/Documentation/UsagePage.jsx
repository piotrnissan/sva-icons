import React, { useState } from 'react';
import CodeExample from './CodeExample';

/**
 * Usage Page Component
 * 
 * Comprehensive usage guide with framework examples
 */
function UsagePage({ icons }) {
  const [activeFramework, setActiveFramework] = useState('javascript');

  const frameworks = {
    javascript: 'JavaScript',
    react: 'React',
    vue: 'Vue',
    angular: 'Angular',
    webcomponents: 'Web Components'
  };

  // Get some sample icons for examples
  const sampleIcons = icons && icons.length > 0 
    ? icons.slice(0, 6) 
    : [
        { name: 'plus', svg: null }, { name: 'car', svg: null }, { name: 'alert', svg: null },
        { name: 'settings', svg: null }, { name: 'home', svg: null }, { name: 'search', svg: null }
      ];

  // Debug: log what we have
  console.log('UsagePage - icons:', icons?.length || 0, 'sample icons:', sampleIcons.length);
  if (sampleIcons.length > 0) {
    console.log('First sample icon:', sampleIcons[0]);
  }

  return (
    <div className="documentation-page">
      <div className="documentation-section">
        <h3>Usage Methods</h3>
        <p>SVA Icons supports multiple integration patterns to fit your project needs.</p>

        <div className="framework-selector">
          {Object.entries(frameworks).map(([key, label]) => (
            <button
              key={key}
              className={`framework-tab ${activeFramework === key ? 'active' : ''}`}
              onClick={() => setActiveFramework(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* JavaScript Examples */}
      {activeFramework === 'javascript' && (
        <div className="framework-content">
          <div className="documentation-section">
            <h4>1. Function-Based Icons (Recommended)</h4>
            <p>The most modern and flexible approach with configurable props:</p>

            <CodeExample
              title="Basic Function Usage"
              code={`import { Plus, Car, Alert } from 'sva-icons';

// Basic usage - returns SVG string
const iconHtml = Plus();

// Configurable with props
const customIcon = Car({
  size: 32,
  color: 'blue',
  className: 'my-custom-icon',
  strokeWidth: 2,
  title: 'Car Icon',
  'aria-label': 'Vehicle indicator'
});

// Use in HTML
document.getElementById('my-button').innerHTML = customIcon;`}
              language="javascript"
              copyable={true}
            />
          </div>

          <div className="documentation-section">
            <h4>2. CreateIcons API</h4>
            <p>Perfect for migrating from icon fonts or CSS pseudo-elements:</p>

            <CodeExample
              title="createIcons Setup"
              code={`import { createIcons } from 'sva-icons/create-icons';
import plus from 'sva-icons/dist/icons/esm/plus.js';
import car from 'sva-icons/dist/icons/esm/car.js';

// Initialize icons (replaces all data-sva-icon elements)
createIcons({
  icons: { plus, car }, // Only these icons will be bundled
  nameAttr: 'data-sva-icon',
  attrs: { 
    class: 'sva-icon', 
    'stroke-width': 1.5 
  }
});`}
              language="javascript"
              copyable={true}
            />

            <CodeExample
              title="HTML Usage"
              code={`<!-- HTML -->
<button class="btn btn-primary">
  <i data-sva-icon="plus" class="btn__icon"></i>
  Add Item
</button>

<div class="status-indicator">
  <i data-sva-icon="car" class="status-icon"></i>
  Vehicle Status
</div>`}
              language="html"
              copyable={true}
            />
          </div>

          <div className="documentation-section">
            <h4>3. Dynamic Loading</h4>
            <p>Load icons on demand for better performance:</p>

            <CodeExample
              title="Lazy Loading"
              code={`// Load icons on demand
async function loadIcon(name) {
  const { [name]: icon } = await import(\`sva-icons/dist/icons/esm/\${name}.js\`);
  return icon;
}

// Usage
const plusIcon = await loadIcon('plus');
document.getElementById('button').innerHTML = plusIcon({ size: 20 });

// With error handling
async function safeLoadIcon(name, fallback = '⭐') {
  try {
    return await loadIcon(name);
  } catch (error) {
    console.warn(\`Icon '\${name}' not found, using fallback\`);
    return () => fallback;
  }
}`}
              language="javascript"
              copyable={true}
            />
          </div>
        </div>
      )}

      {/* React Examples */}
      {activeFramework === 'react' && (
        <div className="framework-content">
          <div className="documentation-section">
            <h4>React Integration</h4>
            <p>Use SVA Icons in React applications with dangerouslySetInnerHTML:</p>

            <CodeExample
              title="React Function Component"
              code={`import { Plus, Settings, Car } from 'sva-icons';

function IconButton({ onClick, iconName = 'plus', children }) {
  const iconMap = { plus: Plus, settings: Settings, car: Car };
  const IconFunction = iconMap[iconName];
  
  const iconHtml = IconFunction({ 
    size: 20, 
    color: 'currentColor',
    className: 'button-icon',
    'aria-hidden': true
  });
  
  return (
    <button onClick={onClick} className="btn">
      <span dangerouslySetInnerHTML={{ __html: iconHtml }} />
      {children}
    </button>
  );
}

// Usage
function App() {
  return (
    <div>
      <IconButton iconName="plus">Add Item</IconButton>
      <IconButton iconName="car">Vehicle Info</IconButton>
      <IconButton iconName="settings">Settings</IconButton>
    </div>
  );
}`}
              language="jsx"
              copyable={true}
            />
          </div>

          <div className="documentation-section">
            <h4>React Hook for Icons</h4>
            <p>Create a custom hook for easier icon management:</p>

            <CodeExample
              title="useIcon Hook"
              code={`import { useState, useEffect } from 'react';

// Custom hook for icon loading
function useIcon(iconName, props = {}) {
  const [iconHtml, setIconHtml] = useState('');
  
  useEffect(() => {
    async function loadIcon() {
      try {
        const { [iconName]: iconFunction } = await import('sva-icons');
        setIconHtml(iconFunction(props));
      } catch (error) {
        console.error(\`Failed to load icon: \${iconName}\`, error);
        setIconHtml(''); // Fallback
      }
    }
    
    loadIcon();
  }, [iconName, props]);
  
  return iconHtml;
}

// Usage in component
function DynamicIcon({ name, size = 24, color = 'currentColor' }) {
  const iconHtml = useIcon(name, { size, color });
  
  if (!iconHtml) return null;
  
  return <span dangerouslySetInnerHTML={{ __html: iconHtml }} />;
}`}
              language="jsx"
              copyable={true}
            />
          </div>
        </div>
      )}

      {/* Vue Examples */}
      {activeFramework === 'vue' && (
        <div className="framework-content">
          <div className="documentation-section">
            <h4>Vue.js Integration</h4>
            <p>Use SVA Icons in Vue applications with v-html directive:</p>

            <CodeExample
              title="Vue Component"
              code={`<template>
  <button @click="handleClick" :aria-label="buttonLabel" class="btn">
    <span v-html="iconHtml" class="btn__icon"></span>
    {{ buttonText }}
  </button>
</template>

<script>
import { Plus, Car, Settings } from 'sva-icons';

export default {
  name: 'IconButton',
  props: {
    icon: { type: String, default: 'plus' },
    size: { type: Number, default: 20 },
    color: { type: String, default: 'currentColor' },
    buttonText: { type: String, required: true }
  },
  computed: {
    iconHtml() {
      const iconMap = { plus: Plus, car: Car, settings: Settings };
      const iconFunction = iconMap[this.icon];
      
      return iconFunction ? iconFunction({
        size: this.size,
        color: this.color,
        'aria-hidden': true
      }) : '';
    },
    buttonLabel() {
      return \`\${this.buttonText} button\`;
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>`}
              language="vue"
              copyable={true}
            />
          </div>

          <div className="documentation-section">
            <h4>Vue Global Icon Component</h4>
            <p>Register a global icon component for use throughout your app:</p>

            <CodeExample
              title="Global Registration"
              code={`// main.js or plugins/icons.js
import { createApp } from 'vue';
import * as SvaIcons from 'sva-icons';

const app = createApp({});

// Global icon component
app.component('SvaIcon', {
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 24 },
    color: { type: String, default: 'currentColor' },
    className: { type: String, default: '' }
  },
  computed: {
    iconHtml() {
      const iconFunction = SvaIcons[this.name];
      if (!iconFunction) {
        console.warn(\`Icon '\${this.name}' not found\`);
        return '';
      }
      
      return iconFunction({
        size: this.size,
        color: this.color,
        className: this.className
      });
    }
  },
  template: \`<span v-html="iconHtml"></span>\`
});

// Usage in any component:
// <SvaIcon name="Plus" :size="20" color="blue" />
// <SvaIcon name="Car" :size="32" class="vehicle-icon" />`}
              language="javascript"
              copyable={true}
            />
          </div>
        </div>
      )}

      {/* Angular Examples */}
      {activeFramework === 'angular' && (
        <div className="framework-content">
          <div className="documentation-section">
            <h4>Angular Integration</h4>
            <p>Use SVA Icons in Angular applications with innerHTML binding:</p>

            <CodeExample
              title="Angular Component"
              code={`import { Component, Input } from '@angular/core';
import { Plus, Car, Settings } from 'sva-icons';

@Component({
  selector: 'app-icon-button',
  template: \`
    <button [attr.aria-label]="ariaLabel" class="btn" (click)="handleClick()">
      <span [innerHTML]="iconHtml" class="btn__icon"></span>
      <ng-content></ng-content>
    </button>
  \`,
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent {
  @Input() icon: string = 'plus';
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() ariaLabel: string = '';

  private iconMap = { plus: Plus, car: Car, settings: Settings };

  get iconHtml() {
    const iconFunction = this.iconMap[this.icon as keyof typeof this.iconMap];
    
    return iconFunction ? iconFunction({
      size: this.size,
      color: this.color,
      'aria-hidden': true
    }) : '';
  }

  handleClick() {
    // Handle click event
  }
}`}
              language="typescript"
              copyable={true}
            />
          </div>

          <div className="documentation-section">
            <h4>Angular Service</h4>
            <p>Create a service for centralized icon management:</p>

            <CodeExample
              title="Icon Service"
              code={`import { Injectable } from '@angular/core';
import * as SvaIcons from 'sva-icons';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  
  getIcon(name: string, props: any = {}): string {
    const iconFunction = (SvaIcons as any)[name];
    
    if (!iconFunction) {
      console.warn(\`Icon '\${name}' not found\`);
      return '';
    }
    
    return iconFunction({
      size: 24,
      color: 'currentColor',
      ...props
    });
  }
  
  getAvailableIcons(): string[] {
    return Object.keys(SvaIcons);
  }
}

// Usage in component:
// constructor(private iconService: IconService) {}
// this.plusIcon = this.iconService.getIcon('Plus', { size: 20 });`}
              language="typescript"
              copyable={true}
            />
          </div>
        </div>
      )}

      {/* Web Components Examples */}
      {activeFramework === 'webcomponents' && (
        <div className="framework-content">
          <div className="documentation-section">
            <h4>Web Components</h4>
            <p>Use SVA Icons as native web components:</p>

            <CodeExample
              title="Standard Web Components"
              code={`<!-- Include the web component script -->
<script src="https://unpkg.com/sva-icons@3.1/dist/web-components/sva-icon.umd.js"></script>

<!-- Use as HTML elements -->
<sva-icon name="car" size="24" color="blue" aria-label="Car"></sva-icon>
<sva-icon name="battery" size="32" color="green" title="Battery status"></sva-icon>
<sva-icon name="alert" size="20" color="red" class="warning-icon"></sva-icon>`}
              language="html"
              copyable={true}
            />
          </div>

          <div className="documentation-section">
            <h4>Tree-shakable Web Components</h4>
            <p>Register only the icons you need for optimal bundle size:</p>

            <CodeExample
              title="Tree-shakable Setup"
              code={`<script type="module">
import { SvaIconRegistry } from 'sva-icons/web-components/tree-shakable';
import plus from 'sva-icons/dist/icons/esm/plus.js';
import car from 'sva-icons/dist/icons/esm/car.js';
import alert from 'sva-icons/dist/icons/esm/alert.js';

// Register only the icons you need
SvaIconRegistry.registerMultiple({ plus, car, alert });
</script>

<!-- Now use the registered icons -->
<sva-icon name="plus" size="16"></sva-icon>
<sva-icon name="car" size="24" color="blue"></sva-icon>
<sva-icon name="alert" size="20" color="red"></sva-icon>`}
              language="html"
              copyable={true}
            />
          </div>
        </div>
      )}

      <div className="documentation-section">
        <h3>Sample Icons</h3>
        <p>Here are some icons from your current set to try in the examples above:</p>
        
        <div className="sample-icons-grid">
          {sampleIcons.map(icon => (
            <div key={icon.name} className="sample-icon-item">
              {icon.svg ? (
                <div 
                  className="sample-icon-preview"
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
              ) : (
                <div className="sample-icon-placeholder">
                  <span className="sample-icon-placeholder-text">
                    {icon.name}
                  </span>
                </div>
              )}
              <code>{icon.name}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="documentation-section">
        <h3>Best Practices</h3>
        <div className="best-practices">
          <div className="best-practice">
            <h4>🎯 Import Only What You Need</h4>
            <p>Use named imports to ensure tree-shaking works properly and keeps your bundle size minimal.</p>
          </div>
          <div className="best-practice">
            <h4>♿ Include Accessibility</h4>
            <p>Always provide appropriate ARIA labels and titles for screen reader users.</p>
          </div>
          <div className="best-practice">
            <h4>🎨 Use CSS Custom Properties</h4>
            <p>Leverage CSS variables for consistent theming across your icon usage.</p>
          </div>
          <div className="best-practice">
            <h4>⚡ Consider Performance</h4>
            <p>For large applications, use dynamic imports or web components to load icons on demand.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsagePage;
