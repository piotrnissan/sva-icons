// build-create-icons.js: Generate createIcons utility
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const outputDir = path.join(projectRoot, 'dist', 'icons');
const createIconsFile = path.join(outputDir, 'create-icons.js');

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

const createIconsCode = `/**
 * SVA Icons - createIcons utility
 * Tree-shakable icon replacement function similar to Lucide
 */

/**
 * Replace elements with data-sva-icon attributes with actual SVG icons
 * @param {Object} options - Configuration options
 * @param {Object} options.icons - Object mapping icon names to SVG strings
 * @param {string} options.nameAttr - Attribute name to search for (default: 'data-sva-icon')
 * @param {Object} options.attrs - Additional attributes to apply to SVG elements
 * @param {string} options.classPrefix - CSS class prefix for icons (default: 'sva-icon')
 * @param {boolean} options.replaceOnly - If true, only replace existing elements, don't add classes
 */
export function createIcons(options = {}) {
  const { 
    icons = {}, 
    nameAttr = 'data-sva-icon',
    attrs = {},
    classPrefix = 'sva-icon',
    replaceOnly = false
  } = options;

  // Find all elements with the data attribute
  const elements = document.querySelectorAll(\`[\${nameAttr}]\`);
  
  elements.forEach(element => {
    const iconName = element.getAttribute(nameAttr);
    const iconSvg = icons[iconName];
    
    if (iconSvg) {
      // Get size and color from element attributes or use defaults
      const size = element.getAttribute('data-size') || element.getAttribute('size') || '24';
      const color = element.getAttribute('data-color') || element.getAttribute('color') || 'currentColor';
      const className = element.getAttribute('class') || '';
      
      // Process the SVG
      let processedSvg = iconSvg;
      
      // Update size attributes
      if (size) {
        const sizeValue = size.toString().match(/^\\d+$/) ? \`\${size}px\` : size;
        processedSvg = processedSvg
          .replace(/width="[^"]*"/g, \`width="\${sizeValue}"\`)
          .replace(/height="[^"]*"/g, \`height="\${sizeValue}"\`);
      }
      
      // Update color (fill) attributes
      if (color && color !== 'currentColor') {
        // Support CSS variables and preserve them
        if (color.startsWith('var(')) {
          processedSvg = processedSvg.replace(/fill="(?!none)[^"]*"/g, \`fill="\${color}"\`);
        } else {
          processedSvg = processedSvg.replace(/fill="(?!none)[^"]*"/g, \`fill="\${color}"\`);
        }
      } else {
        // Default to currentColor for theme compatibility
        processedSvg = processedSvg.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
      }
      
      // Ensure stroke also uses currentColor for outline icons
      if (!processedSvg.includes('stroke=')) {
        processedSvg = processedSvg.replace('<svg', '<svg stroke="currentColor"');
      }
      
      // Add CSS classes
      if (!replaceOnly) {
        const iconClass = \`\${classPrefix} \${classPrefix}-\${iconName}\`;
        const finalClass = className ? \`\${className} \${iconClass}\` : iconClass;
        processedSvg = processedSvg.replace('<svg', \`<svg class="\${finalClass}"\`);
      } else if (className) {
        processedSvg = processedSvg.replace('<svg', \`<svg class="\${className}"\`);
      }
      
      // Apply additional custom attributes
      Object.entries(attrs).forEach(([key, value]) => {
        if (!processedSvg.includes(\`\${key}=\`)) {
          processedSvg = processedSvg.replace('<svg', \`<svg \${key}="\${value}"\`);
        }
      });
      
      // Replace the element
      element.outerHTML = processedSvg;
    } else {
      console.warn(\`SVA Icon not found: \${iconName}\`);
    }
  });
}

/**
 * Create a scoped icon replacer with predefined icons
 * Useful for creating multiple icon contexts
 */
export function createIconsScoped(icons) {
  return function(options = {}) {
    return createIcons({
      ...options,
      icons: { ...icons, ...(options.icons || {}) }
    });
  };
}

/**
 * Async version that can dynamically load icons
 * @param {Object} options - Configuration options
 * @param {Object} options.icons - Object mapping icon names to SVG strings
 * @param {boolean} options.autoLoad - Whether to auto-load missing icons
 * @param {string} options.basePath - Base path for dynamic icon loading
 */
export async function createIconsAsync(options = {}) {
  const { 
    icons = {}, 
    autoLoad = false,
    basePath = './esm/',
    ...restOptions
  } = options;

  const elements = document.querySelectorAll(\`[\${restOptions.nameAttr || 'data-sva-icon'}]\`);
  const iconPromises = [];
  const loadedIcons = { ...icons };

  // Collect all unique icon names
  const iconNames = Array.from(elements).map(el => 
    el.getAttribute(restOptions.nameAttr || 'data-sva-icon')
  ).filter(Boolean);

  const uniqueNames = [...new Set(iconNames)];

  // Load missing icons if autoLoad is enabled
  if (autoLoad) {
    for (const iconName of uniqueNames) {
      if (!loadedIcons[iconName]) {
        iconPromises.push(
          import(\`\${basePath}\${iconName}.js\`)
            .then(module => {
              loadedIcons[iconName] = module.default;
            })
            .catch(error => {
              console.warn(\`Failed to auto-load icon: \${iconName}\`, error);
            })
        );
      }
    }
  }

  // Wait for all icons to load
  await Promise.all(iconPromises);

  // Now create icons with all loaded icons
  createIcons({
    ...restOptions,
    icons: loadedIcons
  });
}

/**
 * Theme-aware icon creator that respects CSS variables and framework themes
 * @param {Object} options - Configuration options
 * @param {Object} options.icons - Icon collection
 * @param {string} options.themeAttribute - Theme attribute name (default: 'data-theme')
 * @param {Object} options.themeColors - Theme-specific color mappings
 */
export function createThemeAwareIcons(options = {}) {
  const {
    icons = {},
    themeAttribute = 'data-theme',
    themeColors = {},
    ...restOptions
  } = options;

  const elements = document.querySelectorAll(\`[\${restOptions.nameAttr || 'data-sva-icon'}]\`);
  
  elements.forEach(element => {
    const iconName = element.getAttribute(restOptions.nameAttr || 'data-sva-icon');
    const iconSvg = icons[iconName];
    
    if (iconSvg) {
      // Detect theme from element or closest themed ancestor
      const themedElement = element.closest(\`[\${themeAttribute}]\`) || document.documentElement;
      const currentTheme = themedElement.getAttribute(themeAttribute) || 'light';
      
      // Get color preference
      let color = element.getAttribute('data-color') || element.getAttribute('color');
      
      // Apply theme-specific colors if defined
      if (!color && themeColors[currentTheme]) {
        color = themeColors[currentTheme].default || 'currentColor';
      }
      
      // Create icons with theme-aware settings
      const iconElement = element;
      iconElement.setAttribute('data-color', color || 'currentColor');
    }
  });
  
  // Use the regular createIcons function
  return createIcons({
    ...restOptions,
    icons
  });
}

// Default export for convenience
export default createIcons;
`;

fs.writeFileSync(createIconsFile, createIconsCode);
console.log('✅ Generated createIcons utility:', createIconsFile);
