import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const svgDir = path.join(projectRoot, 'svg');
const outputBaseDir = path.join(projectRoot, 'dist', 'react');
const esmDir = path.join(outputBaseDir, 'esm');
const cjsDir = path.join(outputBaseDir, 'cjs');

// Ensure output directories exist
[outputBaseDir, esmDir, cjsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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
    try {
      const filePath = path.join(svgDir, file);
      const svgContent = fs.readFileSync(filePath, 'utf8');
      const baseName = path.basename(file, '.svg');
      const componentName = toPascalCase(baseName);
      
      // Skip if component name is invalid
      if (!componentName || !/^[A-Z]/.test(componentName)) {
        console.warn(`⚠️  Skipping invalid component name: ${componentName}`);
        continue;
      }

      const { viewBox, innerContent } = processSvg(svgContent);

      // ESM component
      const esmComponentCode = `import React from 'react';

const ${componentName} = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5,
  className,
  style,
  ...props 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      {...props}
    >
      ${innerContent}
    </svg>
  );
};

${componentName}.displayName = '${componentName}';

export default ${componentName};
`;

      // CJS component  
      const cjsComponentCode = `const React = require('react');

const ${componentName} = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5,
  className,
  style,
  ...props 
}) => {
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: "${viewBox}",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    ...props,
    dangerouslySetInnerHTML: { __html: \`${innerContent}\` }
  });
};

${componentName}.displayName = '${componentName}';

module.exports = ${componentName};
`;

      // Write component files
      const esmPath = path.join(esmDir, `${componentName}.js`);
      const cjsPath = path.join(cjsDir, `${componentName}.js`);
      
      fs.writeFileSync(esmPath, esmComponentCode);
      fs.writeFileSync(cjsPath, cjsComponentCode);
      
      componentExports.push({
        name: componentName,
        originalName: baseName,
        file: `${componentName}.js`
      });

      console.log(`✓ Generated ${componentName}.js`);
    } catch (error) {
      console.error(`✗ Failed to generate component for ${file}:`, error.message);
    }
  }

  // Create common icon aliases
  const aliases = {
    Close: 'Cross',
    Check: 'Tick'
  };

  // Add aliases to exports
  Object.entries(aliases).forEach(([alias, target]) => {
    const targetComponent = componentExports.find(comp => comp.name === target);
    if (targetComponent) {
      componentExports.push({
        name: alias,
        originalName: alias.toLowerCase(),
        file: targetComponent.file,
        isAlias: true,
        aliasFor: target
      });
    }
  });

  // Generate ESM index.js
  const esmIndexContent = componentExports
    .map(comp => {
      if (comp.isAlias) {
        return `export { default as ${comp.name} } from './${comp.aliasFor}.js';`;
      }
      return `export { default as ${comp.name} } from './${comp.name}.js';`;
    })
    .join('\n');

  fs.writeFileSync(path.join(esmDir, 'index.js'), esmIndexContent);

  // Generate CJS index.js
  const cjsIndexContent = componentExports
    .map(comp => {
      if (comp.isAlias) {
        return `module.exports.${comp.name} = require('./${comp.aliasFor}.js');`;
      }
      return `module.exports.${comp.name} = require('./${comp.name}.js');`;
    })
    .join('\n');

  fs.writeFileSync(path.join(cjsDir, 'index.js'), cjsIndexContent);

  // Generate main TypeScript definitions
  const typeDefinitions = `import { FC, SVGProps } from 'react';

export interface ReactIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

export type ReactIconComponent = FC<ReactIconProps>;

${componentExports.map(comp => `export declare const ${comp.name}: ReactIconComponent;`).join('\n')}
`;

  fs.writeFileSync(path.join(outputBaseDir, 'index.d.ts'), typeDefinitions);

  // Create CJS package.json for proper module resolution
  fs.writeFileSync(path.join(cjsDir, 'package.json'), JSON.stringify({ "type": "commonjs" }, null, 2));

  console.log(`\n✅ Generated ${componentExports.length} React components in ${outputBaseDir}`);
  console.log('📄 Created ESM and CJS index files with all exports');
  console.log('📄 Created TypeScript definitions');
  console.log('🎯 Added aliases: Close → Cross, Check → Tick');
}

generateReactComponents().catch(console.error);
