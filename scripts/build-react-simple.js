import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const svgDir = path.join(projectRoot, 'svg');
const outputDir = path.join(projectRoot, 'dist', 'react');
const iconMetadata = JSON.parse(fs.readFileSync(path.join(projectRoot, 'icons.json'), 'utf8'));

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert kebab-case/snake_case to PascalCase and remove invalid characters
function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove invalid characters first
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Clean SVG content and extract path/content
function processSvg(svgContent) {
  // Remove XML declaration, comments
  let cleaned = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  
  // Extract viewBox
  const viewBoxMatch = cleaned.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  
  // Extract inner content (everything between <svg> and </svg>)
  const innerMatch = cleaned.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const innerContent = innerMatch ? innerMatch[1].trim() : '';
  
  return { viewBox, innerContent };
}

async function generateReactComponents() {
  const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));
  const componentExports = [];

  console.log(`Generating React components for ${svgFiles.length} icons...`);

  for (const file of svgFiles) {
    const svgPath = path.join(svgDir, file);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Convert filename to PascalCase component name
    const baseName = path.basename(file, '.svg');
    const componentName = toPascalCase(baseName);

    try {
      const { viewBox, innerContent } = processSvg(svgContent);
      
      // Create React component
      const componentCode = `import React from 'react';

const ${componentName} = ({ size = 24, color = "currentColor", ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="${viewBox}" 
      fill={color}
      {...props}
    >
      ${innerContent}
    </svg>
  );
};

${componentName}.displayName = '${componentName}';

export default ${componentName};
`;

      // Write component file
      const outputPath = path.join(outputDir, `${componentName}.jsx`);
      fs.writeFileSync(outputPath, componentCode);
      
      componentExports.push({
        name: componentName,
        originalName: baseName,
        file: `${componentName}.jsx`
      });

      console.log(`✓ Generated ${componentName}.jsx`);
    } catch (error) {
      console.error(`✗ Failed to generate component for ${file}:`, error.message);
    }
  }

  // Generate index.js with all exports
  const indexContent = componentExports
    .map(comp => `export { default as ${comp.name} } from './${comp.name}.jsx';`)
    .join('\n');

  fs.writeFileSync(path.join(outputDir, 'index.js'), indexContent);

  // Generate a mapping file for easy lookups
  const mappingContent = `export const iconMap = {
${componentExports.map(comp => `  '${comp.originalName}': '${comp.name}'`).join(',\n')}
};

export const iconComponents = {
${componentExports.map(comp => `  '${comp.originalName}': () => import('./${comp.name}.jsx').then(m => m.default)`).join(',\n')}
};
`;

  fs.writeFileSync(path.join(outputDir, 'mapping.js'), mappingContent);

  console.log(`\n✅ Generated ${componentExports.length} React components in ${outputDir}`);
  console.log('📄 Created index.js with all exports');
  console.log('🗺️  Created mapping.js for dynamic imports');
}

generateReactComponents().catch(console.error);
