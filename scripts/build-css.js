// build-css.js: Build script for SVA Icons CSS System
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const stylesDir = path.join(projectRoot, 'src', 'styles');
const outDir = path.join(projectRoot, 'dist');
const outputFile = path.join(outDir, 'sva-icons-class-based.css');

// CSS files to build in order
const cssFiles = [
  'variables.css',
  'base.css', 
  'sizes.css',
  'colors.css',
  'positions.css'
];

console.log('🎨 Building CSS for Class-Based API...');

// Create output directory
fs.mkdirSync(outDir, { recursive: true });

let combinedCSS = '';
let totalFiles = 0;
let totalSize = 0;

// Add header comment
combinedCSS += `/*!
 * SVA Icons Class-Based API - CSS System
 * Version: 2.2.0
 * 
 * This CSS file provides the styling foundation for the SVA Icons Class-Based API.
 * It includes variables, base styles, size utilities, color utilities, and positioning helpers.
 * 
 * Features:
 * - CSS custom properties for theming
 * - Size utilities (xs, sm, md, lg, xl, xxl)
 * - Color utilities (primary, secondary, success, warning, error)
 * - Position utilities (left, right, top, bottom)
 * - Responsive design support
 * - High contrast mode support
 * - Accessibility optimizations
 * 
 * Generated: ${new Date().toISOString()}
 */

`;

// Process each CSS file
cssFiles.forEach(fileName => {
  const filePath = path.join(stylesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Warning: ${fileName} not found, skipping...`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const fileSize = Buffer.byteLength(content, 'utf8');
  
  // Add section header
  combinedCSS += `
/* ====================================
   ${fileName.replace('.css', '').toUpperCase()}
   ==================================== */

`;
  
  // Process and optimize the CSS content
  let processedContent = content
    // Only remove empty lines and normalize whitespace
    .replace(/^\s*\n/gm, '')
    .replace(/\n\s*$/gm, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    // Ensure proper spacing around selectors
    .replace(/}\s*([.#\[])/g, '}\n\n$1')
    .trim();
  
  combinedCSS += processedContent + '\n\n';
  
  totalFiles++;
  totalSize += fileSize;
  
  console.log(`✅ Processed ${fileName} (${fileSize} bytes)`);
});

// Add utility classes for dynamic icon sizing
console.log('🔧 Adding utility classes...');

const utilityCSS = `
/* ====================================
   UTILITY CLASSES
   ==================================== */

/* Icon visibility utilities */
.sva-icon-hidden {
  display: none !important;
}

.sva-icon-visible {
  display: inline-block !important;
}

/* Icon state utilities */
.sva-icon-loading {
  opacity: 0.5;
  animation: sva-icon-pulse 1.5s ease-in-out infinite;
}

.sva-icon-loaded {
  opacity: 1;
  animation: none;
}

.sva-icon-error {
  opacity: 0.3;
  filter: grayscale(100%);
}

/* Loading animation */
@keyframes sva-icon-pulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .sva-icon {
    filter: contrast(1.5);
  }
  
  .sva-icon-loading {
    animation: none;
    opacity: 0.8;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .sva-icon-loading {
    animation: none;
    opacity: 0.5;
  }
  
  @keyframes sva-icon-pulse {
    0%, 100% { opacity: 0.5; }
  }
}

/* Print styles */
@media print {
  .sva-icon {
    filter: grayscale(100%);
    opacity: 0.8;
  }
  
  .sva-icon-loading {
    animation: none;
    opacity: 1;
  }
}

/* Focus management for accessibility */
.sva-icon:focus-visible {
  outline: 2px solid var(--sva-icon-focus-color, #005fcc);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Screen reader utilities */
.sva-icon-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;

combinedCSS += utilityCSS;

// Add responsive breakpoint utilities
const responsiveCSS = `
/* ====================================
   RESPONSIVE UTILITIES
   ==================================== */

/* Mobile-first responsive sizes */
@media (max-width: 768px) {
  .sva-icon-responsive {
    width: var(--sva-icon-size-sm, 16px);
    height: var(--sva-icon-size-sm, 16px);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .sva-icon-responsive {
    width: var(--sva-icon-size-md, 20px);
    height: var(--sva-icon-size-md, 20px);
  }
}

@media (min-width: 1025px) {
  .sva-icon-responsive {
    width: var(--sva-icon-size-lg, 24px);
    height: var(--sva-icon-size-lg, 24px);
  }
}

/* Container queries support (future-proof) */
@supports (container-type: inline-size) {
  .sva-icon-container {
    container-type: inline-size;
  }
  
  @container (max-width: 300px) {
    .sva-icon-adaptive {
      width: var(--sva-icon-size-sm, 16px);
      height: var(--sva-icon-size-sm, 16px);
    }
  }
  
  @container (min-width: 301px) {
    .sva-icon-adaptive {
      width: var(--sva-icon-size-md, 20px);
      height: var(--sva-icon-size-md, 20px);
    }
  }
}
`;

combinedCSS += responsiveCSS;

// Minify CSS for production (simple minification)
console.log('📦 Minifying CSS...');

const minifiedCSS = combinedCSS
  // Remove comments (keep important ones)
  .replace(/\/\*(?!\s*!)[\s\S]*?\*\//g, '')
  // Remove extra whitespace
  .replace(/\s+/g, ' ')
  // Remove whitespace around selectors and properties
  .replace(/\s*{\s*/g, '{')
  .replace(/;\s*/g, ';')
  .replace(/}\s*/g, '}')
  .replace(/,\s*/g, ',')
  .replace(/:\s*/g, ':')
  // Remove trailing semicolons
  .replace(/;}/g, '}')
  .trim();

// Write unminified version
fs.writeFileSync(outputFile, combinedCSS);

// Write minified version
const minifiedFile = outputFile.replace('.css', '.min.css');
fs.writeFileSync(minifiedFile, minifiedCSS);

// Generate CSS stats
const unminifiedSize = Buffer.byteLength(combinedCSS, 'utf8');
const minifiedSize = Buffer.byteLength(minifiedCSS, 'utf8');
const compressionRatio = ((unminifiedSize - minifiedSize) / unminifiedSize * 100).toFixed(1);

// Create CSS build report
const cssReport = {
  timestamp: new Date().toISOString(),
  sourceFiles: totalFiles,
  totalSourceSize: totalSize,
  outputSize: unminifiedSize,
  minifiedSize: minifiedSize,
  compressionRatio: `${compressionRatio}%`,
  outputs: {
    unminified: path.relative(projectRoot, outputFile),
    minified: path.relative(projectRoot, minifiedFile)
  },
  features: [
    'CSS Custom Properties',
    'Size Utilities',
    'Color Utilities',
    'Position Utilities',
    'Responsive Design',
    'High Contrast Support',
    'Accessibility Optimizations',
    'Print Styles',
    'Reduced Motion Support',
    'Container Queries (Future-proof)'
  ]
};

fs.writeFileSync(
  path.join(outDir, 'css-build-report.json'),
  JSON.stringify(cssReport, null, 2)
);

// Validate CSS (basic brace matching only)
console.log('✅ Validating CSS...');
let cssErrors = 0;

// Basic brace matching validation
const cssContent = combinedCSS.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comments
const openBraces = (cssContent.match(/{/g) || []).length;
const closeBraces = (cssContent.match(/}/g) || []).length;

if (openBraces !== closeBraces) {
  console.error(`❌ CSS Error: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
  cssErrors++;
} else {
  console.log('✅ CSS syntax validation passed');
}

console.log('📊 CSS Build Summary:');
console.log(`   Source Files: ${totalFiles}`);
console.log(`   Source Size: ${totalSize} bytes`);
console.log(`   Output Size: ${unminifiedSize} bytes`);
console.log(`   Minified Size: ${minifiedSize} bytes`);
console.log(`   Compression: ${compressionRatio}%`);
console.log(`   Unminified: ${path.relative(projectRoot, outputFile)}`);
console.log(`   Minified: ${path.relative(projectRoot, minifiedFile)}`);
console.log(`   Syntax Errors: ${cssErrors}`);

if (cssErrors === 0) {
  console.log('🎉 CSS build completed successfully!');
} else {
  console.error(`💥 CSS build completed with ${cssErrors} errors!`);
  process.exit(1);
}
