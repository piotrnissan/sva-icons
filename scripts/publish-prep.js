#!/usr/bin/env node
// scripts/publish-prep.js
// Prepare the package for NPM publishing

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

function updatePackageForPublishing() {
  const packagePath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Update package.json for publishing
  const publishPackage = {
    ...packageJson,
    name: "sva-icons",
    version: "1.0.0",
    description: "SVA Icons - A comprehensive icon library for automotive and general UI use",
    main: "./dist/icons/index.js",
    module: "./dist/icons/esm/index.js",
    types: "./dist/icons/index.d.ts",
    files: [
      "dist/**/*",
      "svg/**/*",
      "icons.json",
      "README.md",
      "LICENSE"
    ],
    exports: {
      ".": {
        "import": "./dist/icons/esm/index.js",
        "require": "./dist/icons/cjs/index.js",
        "types": "./dist/icons/index.d.ts"
      },
      "./svg/*": "./svg/*",
      "./react": "./dist/react/index.js",
      "./sprite": "./dist/sprite/sva-icons-sprite.svg",
      "./web-components": "./dist/web-components/sva-icon.js"
    },
    keywords: [
      "icons",
      "svg",
      "automotive",
      "nissan",
      "ui",
      "react",
      "web-components",
      "sprite"
    ],
    repository: {
      "type": "git",
      "url": "https://github.com/nissan/sva-icons.git"
    },
    bugs: {
      "url": "https://github.com/nissan/sva-icons/issues"
    },
    homepage: "https://github.com/nissan/sva-icons#readme",
    license: "MIT",
    publishConfig: {
      "access": "public"
    }
  };
  
  // Remove dev-only scripts for published version
  delete publishPackage.scripts.optimize;
  delete publishPackage.devDependencies;
  
  fs.writeFileSync(packagePath, JSON.stringify(publishPackage, null, 2));
  console.log('✅ Package.json updated for publishing');
}

function generateTypeDefinitions() {
  const iconsJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'icons.json'), 'utf8'));
  const typeDefsPath = path.join(projectRoot, 'dist', 'icons', 'index.d.ts');
  
  const typeDefinitions = `// Auto-generated type definitions for SVA Icons
export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface IconMetadata {
  name: string;
  filename: string;
  category: string;
  tags: string[];
  size: number;
  lastModified: string;
}

// Icon components
${iconsJson.icons.map(icon => {
  const componentName = icon.name.split(/[-_]/).map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join('');
  return `export declare const ${componentName}: React.FC<IconProps>;`;
}).join('\\n')}

// Metadata
export declare const iconMetadata: IconMetadata[];
export declare const categories: string[];

// Utility functions
export declare function getIconsByCategory(category: string): IconMetadata[];
export declare function searchIcons(query: string): IconMetadata[];
export declare function createIcons(icons: { [key: string]: string }): void;
`;

  fs.mkdirSync(path.dirname(typeDefsPath), { recursive: true });
  fs.writeFileSync(typeDefsPath, typeDefinitions);
  console.log('✅ TypeScript definitions generated');
}

function main() {
  console.log('🚀 Preparing SVA Icons for publishing...');
  console.log('='.repeat(50));
  
  updatePackageForPublishing();
  generateTypeDefinitions();
  
  console.log('\\n📦 Publishing checklist:');
  console.log('   ✅ Package.json updated');
  console.log('   ✅ TypeScript definitions generated');
  console.log('   ⚠️  Run "npm run build:all" before publishing');
  console.log('   ⚠️  Test with "npm publish --dry-run"');
  console.log('   ⚠️  Publish with "npm publish"');
  
  console.log('\\n🌐 After publishing, users can install with:');
  console.log('   npm install sva-icons');
  console.log('   yarn add sva-icons');
  console.log('   pnpm add sva-icons');
}

main();
