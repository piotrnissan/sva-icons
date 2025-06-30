#!/usr/bin/env node

/**
 * SVA Icons - Browser Registry Generator
 * 
 * Automatically generates src/icons-browser.js from the svg/ folder
 * to keep the class-based API in sync with current icons.
 * 
 * This script:
 * 1. Reads all SVG files from svg/ folder
 * 2. Converts them to ES module exports
 * 3. Generates icon registry mapping
 * 4. Creates helper functions
 * 5. Writes to src/icons-browser.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const config = {
  svgDir: path.join(projectRoot, 'svg'),
  outputFile: path.join(projectRoot, 'src', 'icons-browser.js'),
  excludePatterns: [
    /^\./, // Hidden files
    /processed/, // Processed folder
    /icons-to-update/, // Update queue folder
    /\.md$/, // Markdown files
    /\.txt$/, // Text files
  ]
};

// JavaScript reserved words and built-in identifiers to avoid
const RESERVED_WORDS = new Set([
  // ES5 Reserved Words
  'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally',
  'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try',
  'typeof', 'var', 'void', 'while', 'with',
  
  // ES5 Strict Mode Reserved Words
  'class', 'const', 'enum', 'export', 'extends', 'import', 'super',
  
  // ES6+ Reserved Words
  'let', 'static', 'yield', 'await', 'async',
  
  // Future Reserved Words
  'implements', 'interface', 'package', 'private', 'protected', 'public',
  
  // Built-in Global Objects (common ones)
  'Array', 'Boolean', 'Date', 'Error', 'Function', 'JSON', 'Math', 'Number', 'Object', 'RegExp', 'String',
  'Symbol', 'console', 'window', 'document', 'undefined', 'null', 'NaN', 'Infinity',
  
  // Browser APIs (common ones that could conflict)
  'alert', 'confirm', 'prompt', 'setTimeout', 'setInterval', 'fetch', 'location', 'history', 'navigator'
]);

/**
 * Convert kebab-case filename to camelCase variable name
 * Handles edge cases like numbers, special characters, reserved words, and invalid JS identifiers
 * @param {string} filename - The SVG filename (without extension)
 * @returns {string} Valid camelCase JavaScript variable name
 */
function toCamelCase(filename) {
  let result = filename
    // Replace hyphens followed by any character (including numbers)
    .replace(/-([a-zA-Z0-9])/g, (match, letter) => letter.toUpperCase())
    // Replace underscores with camelCase
    .replace(/_([a-zA-Z0-9])/g, (match, letter) => letter.toUpperCase())
    // Remove any remaining special characters except alphanumeric
    .replace(/[^a-zA-Z0-9]/g, '')
    // Ensure first character is lowercase letter
    .replace(/^[a-z]/, letter => letter.toLowerCase());
  
  // Handle edge case: if it starts with a number, prefix with 'icon'
  if (/^[0-9]/.test(result)) {
    result = 'icon' + result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  // Handle edge case: if it's empty or invalid, use 'iconUnknown'
  if (!result || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(result)) {
    console.warn(`⚠️  Invalid filename "${filename}" converted to "iconUnknown"`);
    result = 'iconUnknown';
  }
  
  // Handle reserved words: append 'Icon' suffix
  if (RESERVED_WORDS.has(result)) {
    const originalResult = result;
    result = result + 'Icon';
    console.warn(`⚠️  Reserved word "${originalResult}" (from "${filename}") renamed to "${result}"`);
  }
  
  return result;
}

/**
 * Clean and validate SVG content
 * @param {string} svgContent - Raw SVG content
 * @returns {string} Cleaned SVG content
 */
function cleanSvgContent(svgContent) {
  // Remove any extra whitespace and ensure single line
  return svgContent
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

/**
 * Read and process all SVG files from the svg directory
 * @returns {Promise<Array>} Array of {filename, camelName, kebabName, svgContent}
 */
async function readSvgFiles() {
  try {
    const files = await fs.readdir(config.svgDir);
    const svgFiles = files.filter(file => {
      // Must be SVG file
      if (!file.endsWith('.svg')) return false;
      
      // Check exclude patterns
      return !config.excludePatterns.some(pattern => pattern.test(file));
    });

    console.log(`📁 Found ${svgFiles.length} SVG files in ${config.svgDir}`);

    const iconData = [];
    
    for (const file of svgFiles) {
      const filePath = path.join(config.svgDir, file);
      const filename = path.basename(file, '.svg');
      const camelName = toCamelCase(filename);
      
      try {
        const svgContent = await fs.readFile(filePath, 'utf8');
        const cleanedContent = cleanSvgContent(svgContent);
        
        iconData.push({
          filename,
          camelName,
          kebabName: filename,
          svgContent: cleanedContent
        });
        
        console.log(`✅ Processed: ${filename} → ${camelName}`);
      } catch (error) {
        console.error(`❌ Error reading ${file}:`, error.message);
      }
    }

    return iconData.sort((a, b) => a.kebabName.localeCompare(b.kebabName));
  } catch (error) {
    console.error('❌ Error reading SVG directory:', error.message);
    throw error;
  }
}

/**
 * Generate the icons-browser.js file content
 * @param {Array} iconData - Array of icon data objects
 * @returns {string} Generated file content
 */
function generateBrowserFile(iconData) {
  const timestamp = new Date().toISOString();
  const iconCount = iconData.length;
  
  let content = `/**
 * Browser-compatible icon registry for SVA Icons
 * Contains ES module exports of all available icons
 * 
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated: ${timestamp}
 * Source: svg/ folder (${iconCount} icons)
 * 
 * To regenerate: npm run build:icons-browser
 */

`;

  // Generate icon exports
  content += `// ===== ICON EXPORTS =====\n`;
  iconData.forEach(icon => {
    content += `export const ${icon.camelName} = \`${icon.svgContent}\`;\n\n`;
  });

  // Generate icon registry
  content += `// ===== ICON REGISTRY =====\n`;
  content += `export const iconRegistry = {\n`;
  iconData.forEach(icon => {
    content += `  '${icon.kebabName}': () => ${icon.camelName},\n`;
  });
  content += `};\n\n`;

  // Generate helper functions
  content += `// ===== HELPER FUNCTIONS =====\n`;
  content += `/**
 * Get all available icons
 * @returns {Object} Icon registry object
 */
export function getAllIcons() {
  return iconRegistry;
}

/**
 * Get icon by name
 * @param {string} name - Icon name (kebab-case)
 * @returns {string|null} SVG content or null if not found
 */
export function getIcon(name) {
  const iconFunction = iconRegistry[name];
  return iconFunction ? iconFunction() : null;
}

/**
 * Get all icon names
 * @returns {string[]} Array of icon names
 */
export function getIconNames() {
  return Object.keys(iconRegistry);
}

/**
 * Check if icon exists
 * @param {string} name - Icon name to check
 * @returns {boolean} True if icon exists
 */
export function hasIcon(name) {
  return name in iconRegistry;
}

/**
 * Get icon count
 * @returns {number} Number of available icons
 */
export function getIconCount() {
  return Object.keys(iconRegistry).length;
}
`;

  return content;
}

/**
 * Write the generated content to the output file
 * @param {string} content - Generated file content
 */
async function writeOutputFile(content) {
  try {
    // Ensure the src directory exists
    const srcDir = path.dirname(config.outputFile);
    await fs.mkdir(srcDir, { recursive: true });
    
    // Write the file
    await fs.writeFile(config.outputFile, content, 'utf8');
    console.log(`✅ Generated: ${config.outputFile}`);
  } catch (error) {
    console.error('❌ Error writing output file:', error.message);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting Icon Browser Registry Generation...\n');
    
    console.log(`📂 SVG Source Directory: ${config.svgDir}`);
    console.log(`📄 Output File: ${config.outputFile}\n`);
    
    // Read and process SVG files
    const iconData = await readSvgFiles();
    
    if (iconData.length === 0) {
      console.warn('⚠️  No SVG files found to process');
      return;
    }
    
    console.log(`\n📊 Processing ${iconData.length} icons...`);
    
    // Generate file content
    const content = generateBrowserFile(iconData);
    
    // Write output file
    await writeOutputFile(content);
    
    console.log(`\n🎉 Successfully generated browser registry!`);
    console.log(`📊 Icons processed: ${iconData.length}`);
    console.log(`📄 Output file: ${path.relative(projectRoot, config.outputFile)}`);
    console.log(`\n🔄 Next step: Run 'npm run build:class-based' to rebuild class-based API`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
