#!/usr/bin/env node
/**
 * build-function-icons.js
 * Transforms static SVG string exports to configurable icon functions
 * This addresses SVA framework feedback requiring SvaIconComponent functions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Paths
const svgDir = path.join(projectRoot, 'svg');
const esmDir = path.join(projectRoot, 'dist', 'icons', 'esm');
const cjsDir = path.join(projectRoot, 'dist', 'icons', 'cjs');

/**
 * Convert kebab-case or snake_case to PascalCase
 */
function toPascalCase(str) {
  return str
    .replace(/[-_\s]/g, ' ')  // Replace hyphens, underscores, and spaces with spaces
    .replace(/(?:^|\s)(\w)/g, (_, char) => char.toUpperCase())  // Capitalize first letter of each word
    .replace(/\s/g, '');  // Remove all spaces
}

/**
 * Generate function-based icon from SVG content
 */
function generateIconFunction(name, svgContent, format = 'esm') {
  const functionName = toPascalCase(name);
  
  // Clean and prepare SVG content
  const cleanSvg = svgContent
    .replace(/`/g, '\\`')  // Escape backticks
    .replace(/\\$/g, '\\$') // Escape dollar signs
    .trim();
  
  // Extract viewBox from SVG if present
  const viewBoxMatch = cleanSvg.match(/viewBox="([^"]+)"/);
  const defaultViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  // Extract full inner SVG content (all children), preserving multiple paths/groups
  const innerMatch = cleanSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  let innerContent = innerMatch ? innerMatch[1].trim() : cleanSvg;

  // Enforce single-color theming and no-stroke policy on inner content
  // - Remove any stroke/stroke-width/style attributes if present
  // - Remove any hard-coded fill values except fill="none"
  innerContent = innerContent
    .replace(/\sstroke=\"[^\"]*\"/gi, '')
    .replace(/\sstroke-width=\"[^\"]*\"/gi, '')
    .replace(/\sstyle=\"[^\"]*\"/gi, '')
    .replace(/\sfill=\"(?!none\b)[^\"]*\"/gi, '');
  
  if (format === 'esm') {
    return `/**
 * ${functionName} Icon
 * SVA Icons - Function-based icon component
 * 
 * @param {Object} props - Icon configuration
 * @param {number|string} props.size - Icon size (default: 24)
 * @param {string} props.color - Icon color (default: 'currentColor')
 * @param {string} props.className - CSS classes
 * @param {number} props.strokeWidth - Stroke width (unused; strokes disabled)
 * @param {string} props.title - Accessibility title
 * @param {boolean} props.focusable - Whether icon is focusable (default: false)
 * @returns {string} SVG string
 */
export default function ${functionName}(props = {}) {
  const { 
    size = 24, 
    color = 'currentColor', 
    className = '',
    strokeWidth = 0,
    title,
    focusable = false,
    'aria-hidden': ariaHidden = true,
    ...otherProps 
  } = props;
  
  const classNames = ['sva-icon', 'sva-icon-${name}', className].filter(Boolean).join(' ');
  
  const titleElement = title ? \`<title>\${title}</title>\` : '';
  
  const additionalProps = Object.entries(otherProps)
    .map(([key, value]) => \`\${key}="\${value}"\`)
    .join(' ');
  
  return \`<svg 
    width="\${size}" 
    height="\${size}" 
    viewBox="${defaultViewBox}" 
    class="\${classNames}"
    fill="\${color}"
    stroke="none"
    focusable="\${focusable}"
    aria-hidden="\${ariaHidden}"
    \${additionalProps ? ' ' + additionalProps : ''}
  >\${titleElement}${innerContent}</svg>\`;
}

// Named export for convenience
export { ${functionName} };
`;
  } else {
    // CommonJS format
    return `/**
 * ${functionName} Icon
 * SVA Icons - Function-based icon component
 * 
 * @param {Object} props - Icon configuration
 * @param {number|string} props.size - Icon size (default: 24)
 * @param {string} props.color - Icon color (default: 'currentColor')
 * @param {string} props.className - CSS classes
 * @param {number} props.strokeWidth - Stroke width (unused; strokes disabled)
 * @param {string} props.title - Accessibility title
 * @param {boolean} props.focusable - Whether icon is focusable (default: false)
 * @returns {string} SVG string
 */
function ${functionName}(props = {}) {
  const { 
    size = 24, 
    color = 'currentColor', 
    className = '',
    strokeWidth = 0,
    title,
    focusable = false,
    'aria-hidden': ariaHidden = true,
    ...otherProps 
  } = props;
  
  const classNames = ['sva-icon', 'sva-icon-${name}', className].filter(Boolean).join(' ');
  
  const titleElement = title ? \`<title>\${title}</title>\` : '';
  
  const additionalProps = Object.entries(otherProps)
    .map(([key, value]) => \`\${key}="\${value}"\`)
    .join(' ');
  
  return \`<svg 
    width="\${size}" 
    height="\${size}" 
    viewBox="${defaultViewBox}" 
    class="\${classNames}"
    fill="\${color}"
    stroke="none"
    focusable="\${focusable}"
    aria-hidden="\${ariaHidden}"
    \${additionalProps ? ' ' + additionalProps : ''}
  >\${titleElement}${innerContent}</svg>\`;
}

module.exports = ${functionName};
module.exports.default = ${functionName};
`;
  }
}

/**
 * Transform all SVG files to function-based icons
 */
function transformIcons() {
  console.log('🔄 SVA Icons - Function-Based Transformation');
  console.log('===========================================');
  
  // Ensure directories exist
  fs.mkdirSync(esmDir, { recursive: true });
  fs.mkdirSync(cjsDir, { recursive: true });
  
  // Get all SVG files
  const svgFiles = fs.readdirSync(svgDir)
    .filter(file => file.endsWith('.svg'))
    .sort();
  
  if (svgFiles.length === 0) {
    console.error('❌ No SVG files found in', svgDir);
    process.exit(1);
  }
  
  console.log(`📊 Found ${svgFiles.length} SVG files to transform`);
  
  let transformedCount = 0;
  
  svgFiles.forEach(file => {
    const name = path.basename(file, '.svg');
    const svgPath = path.join(svgDir, file);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    try {
      // Generate ESM function
      const esmFunction = generateIconFunction(name, svgContent, 'esm');
      const esmPath = path.join(esmDir, `${name}.js`);
      fs.writeFileSync(esmPath, esmFunction, 'utf8');
      
      // Generate CJS function
      const cjsFunction = generateIconFunction(name, svgContent, 'cjs');
      const cjsPath = path.join(cjsDir, `${name}.js`);
      fs.writeFileSync(cjsPath, cjsFunction, 'utf8');
      
      transformedCount++;
      
      if (transformedCount % 50 === 0) {
        console.log(`📝 Transformed ${transformedCount}/${svgFiles.length} icons...`);
      }
      
    } catch (error) {
      console.error(`❌ Error transforming ${name}:`, error.message);
    }
  });
  
  console.log(`✅ Successfully transformed ${transformedCount} icons to function-based format`);
  console.log(`📁 ESM functions: ${esmDir}`);
  console.log(`📁 CJS functions: ${cjsDir}`);
  
  return transformedCount;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting Function-Based Icon Transformation...');
  
  try {
    const transformedCount = transformIcons();
    
    console.log('\\n🎯 Transformation Complete!');
    console.log('============================');
    console.log(`✅ ${transformedCount} icons transformed to functions`);
    console.log('✅ ESM and CJS function exports created');
    console.log('\\n📋 Next Steps:');
    console.log('   1. Run: node scripts/build-index-files.js');
    console.log('   2. Test: node .test/test-esm-imports.mjs');
    console.log('   3. Update TypeScript definitions');
    console.log('\\n🎉 Icons now support props:');
    console.log('   Plus({ size: 32, color: "blue", className: "my-icon" })');
    
  } catch (error) {
    console.error('❌ Transformation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url.endsWith('build-function-icons.js')) {
  main();
}

export { transformIcons, generateIconFunction };
