/**
 * Import Map Generator for SVA Icons
 * Generates import maps for different environments with individual icon mappings
 */

import fs from 'fs';
import path from 'path';

/**
 * Get list of available icons from the dist directory
 */
function getAvailableIcons() {
  const iconsDir = path.join(process.cwd(), 'dist', 'icons', 'esm');
  
  if (!fs.existsSync(iconsDir)) {
    console.warn('⚠️  Icons directory not found. Run npm run build:icons first.');
    return [];
  }
  
  try {
    const files = fs.readdirSync(iconsDir);
    const iconFiles = files.filter(file => file.endsWith('.js') && file !== 'index.js');
    const iconNames = iconFiles.map(file => file.replace('.js', ''));
    
    console.log(`📦 Found ${iconNames.length} icons for import mapping`);
    return iconNames;
  } catch (error) {
    console.warn('⚠️  Could not read icons directory:', error.message);
    return [];
  }
}

/**
 * Generate import map based on environment and options
 */
function generateImportMap(options) {
  console.log('🔧 Generating import map...');
  
  const { output, basePath, environment, includeIndividualIcons = true } = options;
  const availableIcons = includeIndividualIcons ? getAvailableIcons() : [];
  
  // Base import map structure
  const importMap = {
    imports: {}
  };

  // Different configurations based on environment
  switch (environment) {
    case 'browser':
      // Main entry points
      importMap.imports = {
        'sva-icons': `${basePath}sva-icons/dist/icons/esm/index.js`,
        'sva-icons/class-based': `${basePath}sva-icons/dist/class-based/esm/index.js`,
        'sva-icons/react': `${basePath}sva-icons/dist/react/esm/index.js`,
        'sva-icons/bundles': `${basePath}sva-icons/dist/bundles/index.js`
      };
      
      // Individual icon mappings for tree-shaking
      if (availableIcons.length > 0) {
        availableIcons.forEach(iconName => {
          importMap.imports[`sva-icons/icons/${iconName}`] = `${basePath}sva-icons/dist/icons/esm/${iconName}.js`;
        });
      }
      break;
      
    case 'vite':
      // Main entry points  
      importMap.imports = {
        'sva-icons': 'sva-icons',
        'sva-icons/class-based': 'sva-icons/dist/class-based/esm/index.js',
        'sva-icons/react': 'sva-icons/dist/react/esm/index.js',
        'sva-icons/bundles': 'sva-icons/dist/bundles/index.js'
      };
      
      // Individual icon mappings
      if (availableIcons.length > 0) {
        availableIcons.forEach(iconName => {
          importMap.imports[`sva-icons/icons/${iconName}`] = `sva-icons/dist/icons/esm/${iconName}.js`;
        });
      }
      break;
      
    case 'webpack':
      // Main entry points
      importMap.imports = {
        'sva-icons': 'sva-icons/dist/icons/esm/index.js',
        'sva-icons/class-based': 'sva-icons/dist/class-based/esm/index.js',
        'sva-icons/react': 'sva-icons/dist/react/esm/index.js',
        'sva-icons/bundles': 'sva-icons/dist/bundles/index.js'
      };
      
      // Individual icon mappings
      if (availableIcons.length > 0) {
        availableIcons.forEach(iconName => {
          importMap.imports[`sva-icons/icons/${iconName}`] = `sva-icons/dist/icons/esm/${iconName}.js`;
        });
      }
      break;
      
    default:
      console.error(`❌ Unknown environment: ${environment}`);
      process.exit(1);
  }

  try {
    const totalMappings = Object.keys(importMap.imports).length;
    const mainMappings = 4; // sva-icons, class-based, react, bundles
    const iconMappings = totalMappings - mainMappings;
    
    if (options.inline) {
      // Generate inline HTML snippet for Live Preview
      const inlineHtml = `<script type="importmap">
${JSON.stringify(importMap, null, 2)}
</script>`;
      
      const outputFile = output.replace('.json', '.html');
      fs.writeFileSync(outputFile, inlineHtml);
      
      console.log(`✅ Inline import map generated: ${outputFile}`);
      console.log(`📦 Environment: ${environment}`);
      console.log(`🎯 Total mappings: ${totalMappings} (${mainMappings} main + ${iconMappings} icons)`);
      console.log(`📋 Copy this into your HTML <head> section for Live Preview:`);
      console.log(inlineHtml);
      
    } else {
      // Write import map to JSON file
      fs.writeFileSync(output, JSON.stringify(importMap, null, 2));
      
      console.log(`✅ Import map generated: ${output}`);
      console.log(`📦 Environment: ${environment}`);
      console.log(`📂 Base path: ${basePath}`);
      console.log(`🎯 Total mappings: ${totalMappings} (${mainMappings} main + ${iconMappings} icons)`);
      
      // Show preview (truncated for many icons)
      if (iconMappings > 10) {
        console.log('\n📋 Generated import map (showing first 10 icon mappings):');
        const truncatedMap = {
          imports: {
            ...Object.fromEntries(Object.entries(importMap.imports).slice(0, 14)) // 4 main + 10 icons
          }
        };
        if (iconMappings > 10) {
          truncatedMap.imports[`... and ${iconMappings - 10} more icon mappings`] = '...';
        }
        console.log(JSON.stringify(truncatedMap, null, 2));
      } else {
        console.log('\n📋 Generated import map:');
        console.log(JSON.stringify(importMap, null, 2));
      }
      
      // Show Live Preview tip
      console.log('\n💡 For VS Code Live Preview, use: --inline flag to generate HTML snippet');
    }
    
  } catch (error) {
    console.error(`❌ Error writing import map: ${error.message}`);
    process.exit(1);
  }
}

export { generateImportMap };
