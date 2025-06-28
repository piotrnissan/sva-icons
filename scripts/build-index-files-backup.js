#!/usr/bin/env node
/**
 * build-index-files.js
 * Generates the missing index files for ESM and CJS directories
 * This fixes the critical import issue blocking SVA framework integration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Paths
const esmDir = path.join(projectRoot, 'dist', 'icons', 'esm');
const cjsDir = path.join(projectRoot, 'dist', 'icons', 'cjs');

/**
 * Convert kebab-case or snake_case to PascalCase
 */
function toPascalCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/(?:^|\s)(\w)/g, (_, char) => char.toUpperCase())
    .replace(/\s/g, '');
}

/**
 * Get all icon files from directory
 */
function getIconFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    return [];
  }
  
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.js') && f !== 'index.js')
    .map(f => path.basename(f, '.js'))
    .sort();
}

/**
 * Generate ESM index file
 */
function generateESMIndex(iconFiles) {
  console.log(`📝 Generating ESM index for ${iconFiles.length} icons...`);
  
  // Generate both named exports and imports for allIcons object
  const imports = iconFiles.map(name => {
    const componentName = toPascalCase(name);
    return `export { default as ${componentName} } from './${name}.js';`;
  }).join('\n');
  
  // For the allIcons object, we need to import them as variables
  const iconImports = iconFiles.map(name => {
    const componentName = toPascalCase(name);
    return `import ${componentName}_Icon from './${name}.js';`;
  }).join('\n');
  
  const allIconsExports = iconFiles.map(name => {
    const componentName = toPascalCase(name);
    return `  ${componentName}: ${componentName}_Icon`;
  }).join(',\n');
  
  // Common aliases for frequently used icons
  const commonAliases = [
    { name: 'Plus', file: 'plus' },
    { name: 'Minus', file: 'minus' },
    { name: 'Close', file: 'cross' },
    { name: 'Search', file: 'search' },
    { name: 'Home', file: 'home' },
    { name: 'Settings', file: 'settings' },
    { name: 'User', file: 'user' },
    { name: 'Car', file: 'car' },
    { name: 'Battery', file: 'battery' },
    { name: 'Alert', file: 'alert' },
    { name: 'Calendar', file: 'calendar' },
    { name: 'Clock', file: 'clock' },
    { name: 'Download', file: 'download' },
    { name: 'Upload', file: 'upload' },
    { name: 'Edit', file: 'edit' },
    { name: 'Delete', file: 'delete' },
    { name: 'Check', file: 'check' },
    { name: 'Warning', file: 'warning' },
    { name: 'Info', file: 'info' },
    { name: 'Error', file: 'error' },
    { name: 'Success', file: 'success' },
    { name: 'Play', file: 'play' },
    { name: 'Pause', file: 'pause' },
    { name: 'Stop', file: 'stop' },
    { name: 'Forward', file: 'forward' },
    { name: 'Backward', file: 'backward' },
    { name: 'Volume', file: 'volume' },
    { name: 'FullScreen', file: 'full_screen' },
    { name: 'Refresh', file: 'refresh' },
    { name: 'Share', file: 'share' },
    { name: 'Link', file: 'link' },
    { name: 'Copy', file: 'copy' },
    { name: 'Save', file: 'save' },
    { name: 'Print', file: 'print' },
    { name: 'Filter', file: 'filter' },
    { name: 'Grid', file: 'grid' },
    { name: 'List', file: 'list' },
    { name: 'Lock', file: 'lock' },
    { name: 'Unlock', file: 'unlock' },
    { name: 'Eye', file: 'eye' },
    { name: 'ZoomIn', file: 'zoom_in' },
    { name: 'ZoomOut', file: 'zoom_out' }
  ];
  
  // Filter out aliases that would create duplicates with existing auto-generated exports
  const existingExports = iconFiles.map(toPascalCase);
  const validAliases = commonAliases.filter(alias => 
    iconFiles.includes(alias.file) && !existingExports.includes(alias.name)
  );
  
  const aliasExports = validAliases.map(alias => 
    `// ${alias.name} alias for convenience\nexport { default as ${alias.name} } from './${alias.file}.js';`
  ).join('\n');
  
  const content = `/**
 * SVA Icons - ESM Index
 * Auto-generated index file for ES Module imports
 * 
 * Usage:
 *   import { Plus, Minus, Alert } from 'sva-icons';
 *   import * as SvaIcons from 'sva-icons';
 *   import { allIcons } from 'sva-icons';
 */

// Import icons for allIcons object
${iconImports}

// Named exports
${imports}

${aliasExports}

// All icons collection for bulk access
export const allIcons = {
${allIconsExports}
};

// Icon count and metadata
export const iconCount = ${iconFiles.length};
export const iconNames = [${iconFiles.map(name => `'${name}'`).join(', ')}];

// Default export for convenience
export default allIcons;
`;

  const outputPath = path.join(esmDir, 'index.js');
  fs.writeFileSync(outputPath, content, 'utf8');
  
  console.log(`✅ ESM index created: ${outputPath}`);
  return content;
}

/**
 * Generate CJS index file
 */
function generateCJSIndex(iconFiles) {
  console.log(`📝 Generating CJS index for ${iconFiles.length} icons...`);
  
  const requires = iconFiles.map(name => {
    const componentName = toPascalCase(name);
    return `const ${componentName} = require('./${name}.js');`;
  }).join('\n');
  
  const moduleExports = iconFiles.map(toPascalCase).join(',\n  ');
  
  // Common aliases for frequently used icons
  const commonAliases = [
    { name: 'Plus', file: 'plus' },
    { name: 'Minus', file: 'minus' },
    { name: 'Close', file: 'cross' },
    { name: 'Search', file: 'search' },
    { name: 'Home', file: 'home' },
    { name: 'Settings', file: 'settings' },
    { name: 'User', file: 'user' },
    { name: 'Car', file: 'car' },
    { name: 'Battery', file: 'battery' },
    { name: 'Alert', file: 'alert' },
    { name: 'Calendar', file: 'calendar' },
    { name: 'Clock', file: 'clock' },
    { name: 'Download', file: 'download' },
    { name: 'Upload', file: 'upload' },
    { name: 'Edit', file: 'edit' },
    { name: 'Delete', file: 'delete' },
    { name: 'Check', file: 'check' },
    { name: 'Warning', file: 'warning' },
    { name: 'Info', file: 'info' },
    { name: 'Error', file: 'error' },
    { name: 'Success', file: 'success' },
    { name: 'Play', file: 'play' },
    { name: 'Pause', file: 'pause' },
    { name: 'Stop', file: 'stop' },
    { name: 'Forward', file: 'forward' },
    { name: 'Backward', file: 'backward' },
    { name: 'Volume', file: 'volume' },
    { name: 'FullScreen', file: 'full_screen' },
    { name: 'Refresh', file: 'refresh' },
    { name: 'Share', file: 'share' },
    { name: 'Link', file: 'link' },
    { name: 'Copy', file: 'copy' },
    { name: 'Save', file: 'save' },
    { name: 'Print', file: 'print' },
    { name: 'Filter', file: 'filter' },
    { name: 'Grid', file: 'grid' },
    { name: 'List', file: 'list' },
    { name: 'Lock', file: 'lock' },
    { name: 'Unlock', file: 'unlock' },
    { name: 'Eye', file: 'eye' },
    { name: 'ZoomIn', file: 'zoom_in' },
    { name: 'ZoomOut', file: 'zoom_out' }
  ];
  
  // Filter out aliases that would create duplicates with existing auto-generated exports
  const existingExports = iconFiles.map(toPascalCase);
  const validCjsAliases = commonAliases.filter(alias => 
    iconFiles.includes(alias.file) && !existingExports.includes(alias.name)
  );
  
  const aliasRequires = validCjsAliases.map(alias => 
    `// ${alias.name} alias for convenience\nconst ${alias.name} = require('./${alias.file}.js');`
  ).join('\n');
  
  const aliasExports = validCjsAliases.map(alias => alias.name).join(',\n  ');
  
  const content = `/**
 * SVA Icons - CommonJS Index
 * Auto-generated index file for CommonJS imports
 * 
 * Usage:
 *   const { Plus, Minus, Alert } = require('sva-icons');
 *   const SvaIcons = require('sva-icons');
 *   const { allIcons } = require('sva-icons');
 */

${requires}

${aliasRequires}

module.exports = {
  ${moduleExports},
  ${aliasExports},
  
  // All icons collection for bulk access
  allIcons: {
    ${moduleExports}
  },
  
  // Icon count and metadata
  iconCount: ${iconFiles.length},
  iconNames: [${iconFiles.map(name => `'${name}'`).join(', ')}]
};
`;

  const outputPath = path.join(cjsDir, 'index.js');
  fs.writeFileSync(outputPath, content, 'utf8');
  
  console.log(`✅ CJS index created: ${outputPath}`);
  return content;
}

/**
 * Update TypeScript definitions
 */
function generateTypeDefinitions(iconFiles) {
  console.log(`📝 Generating TypeScript definitions for ${iconFiles.length} icons...`);
  
  const iconExports = iconFiles.map(name => {
    const componentName = toPascalCase(name);
    return `export declare const ${componentName}: SvaIconComponent;`;
  }).join('\n');
  
  // Common aliases
  const commonAliases = [
    { name: 'Plus', file: 'plus' },
    { name: 'Minus', file: 'minus' },
    { name: 'Close', file: 'cross' },
    { name: 'Search', file: 'search' },
    { name: 'Home', file: 'home' },
    { name: 'Settings', file: 'settings' },
    { name: 'User', file: 'user' },
    { name: 'Car', file: 'car' },
    { name: 'Battery', file: 'battery' },
    { name: 'Alert', file: 'alert' },
    { name: 'Calendar', file: 'calendar' },
    { name: 'Clock', file: 'clock' },
    { name: 'Download', file: 'download' },
    { name: 'Upload', file: 'upload' },
    { name: 'Edit', file: 'edit' },
    { name: 'Delete', file: 'delete' },
    { name: 'Check', file: 'check' },
    { name: 'Warning', file: 'warning' },
    { name: 'Info', file: 'info' },
    { name: 'Error', file: 'error' },
    { name: 'Success', file: 'success' },
    { name: 'Play', file: 'play' },
    { name: 'Pause', file: 'pause' },
    { name: 'Stop', file: 'stop' },
    { name: 'Forward', file: 'forward' },
    { name: 'Backward', file: 'backward' },
    { name: 'Volume', file: 'volume' },
    { name: 'FullScreen', file: 'full_screen' },
    { name: 'Refresh', file: 'refresh' },
    { name: 'Share', file: 'share' },
    { name: 'Link', file: 'link' },
    { name: 'Copy', file: 'copy' },
    { name: 'Save', file: 'save' },
    { name: 'Print', file: 'print' },
    { name: 'Filter', file: 'filter' },
    { name: 'Grid', file: 'grid' },
    { name: 'List', file: 'list' },
    { name: 'Lock', file: 'lock' },
    { name: 'Unlock', file: 'unlock' },
    { name: 'Eye', file: 'eye' },
    { name: 'ZoomIn', file: 'zoom_in' },
    { name: 'ZoomOut', file: 'zoom_out' }
  ].filter(alias => iconFiles.includes(alias.file));
  
  const aliasExports = commonAliases.map(alias => 
    `export declare const ${alias.name}: SvaIconComponent;`
  ).join('\n');
  
  const allIconsType = iconFiles.map(toPascalCase).join(';\n  ') + ';';
  
  const content = `/**
 * SVA Icons - TypeScript Definitions
 * Auto-generated type definitions for SVA Icons
 * 
 * @version 2.0.1
 */

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  title?: string;
}

export type SvaIconComponent = (props?: IconProps) => string;

// All icon exports
${iconExports}

// Common aliases for convenience
${aliasExports}

// All icons collection type
export declare const allIcons: {
  ${allIconsType}
};

// Utility types
export type SvaIconName = keyof typeof allIcons;
export declare const iconCount: number;
export declare const iconNames: string[];

// Helper functions
export declare function getSvaIcon(name: SvaIconName, props?: IconProps): string;
export declare function getAllSvaIcons(): typeof allIcons;
export declare function getSvaIconNames(): SvaIconName[];

// Default export
export default allIcons;
`;

  const outputPath = path.join(projectRoot, 'dist', 'icons', 'index.d.ts');
  fs.writeFileSync(outputPath, content, 'utf8');
  
  console.log(`✅ TypeScript definitions updated: ${outputPath}`);
  return content;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 SVA Icons - Generating Index Files');
  console.log('=====================================');
  
  // Get icon files from ESM directory (primary source)
  const iconFiles = getIconFiles(esmDir);
  
  if (iconFiles.length === 0) {
    console.error('❌ No icon files found. Make sure the build process has run first.');
    process.exit(1);
  }
  
  console.log(`📊 Found ${iconFiles.length} icon files`);
  console.log(`📁 ESM Directory: ${esmDir}`);
  console.log(`📁 CJS Directory: ${cjsDir}`);
  
  try {
    // Generate index files
    generateESMIndex(iconFiles);
    generateCJSIndex(iconFiles);
    generateTypeDefinitions(iconFiles);
    
    console.log('\n✅ SUCCESS: All index files generated successfully!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Test imports: npm run test:imports');
    console.log('   2. Build packages: npm run build');
    console.log('   3. Publish release: npm publish');
    
    console.log('\n📋 Import patterns now supported:');
    console.log('   import { Plus, Minus, Close } from "sva-icons";');
    console.log('   import * as SvaIcons from "sva-icons";');
    console.log('   const { Plus, Minus } = require("sva-icons");');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url.endsWith('build-index-files.js')) {
  main();
}

export { generateESMIndex, generateCJSIndex, generateTypeDefinitions };
