import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

/**
 * Generate TypeScript definition files for individual icon files
 */
function generateIndividualTypeDefinitions() {
  console.log('🚀 Generating individual TypeScript definitions for SVA Icons');
  console.log('============================================================');

  const esmDir = path.join(projectRoot, 'dist', 'icons', 'esm');
  const cjsDir = path.join(projectRoot, 'dist', 'icons', 'cjs');

  if (!fs.existsSync(esmDir)) {
    console.error('❌ ESM directory not found. Run the build process first.');
    process.exit(1);
  }

  // Get all icon files (excluding index.js)
  const iconFiles = fs.readdirSync(esmDir)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .map(file => file.replace('.js', ''));

  console.log(`📊 Found ${iconFiles.length} icon files to process`);

  let createdCount = 0;

  iconFiles.forEach(iconName => {
    const jsFileName = `${iconName}.js`;
    const dtsFileName = `${iconName}.d.ts`;
    
    // Read the JS file to extract function name and JSDoc
    const jsFilePath = path.join(esmDir, jsFileName);
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');
    
    // Extract function name from the JS file
    const functionMatch = jsContent.match(/export default function (\w+)/);
    if (!functionMatch) {
      console.warn(`⚠️  Could not find function name in ${jsFileName}`);
      return;
    }
    
    const functionName = functionMatch[1];
    
    // Extract JSDoc comments
    const jsdocMatch = jsContent.match(/\/\*\*([\s\S]*?)\*\//);
    const jsdocComment = jsdocMatch ? jsdocMatch[0] : `/**\n * ${functionName} Icon\n */`;

    // Generate TypeScript definition content
    const dtsContent = `${jsdocComment}

export interface IconProps {
  /** Icon size (default: 24) */
  size?: number | string;
  /** Icon color (default: 'currentColor') */
  color?: string;
  /** CSS classes to apply */
  className?: string;
  /** Stroke width (default: 1.5) */
  strokeWidth?: number;
  /** Accessibility title */
  title?: string;
  /** Whether icon is focusable (default: false) */
  focusable?: boolean;
  /** Additional CSS styles */
  style?: Record<string, any>;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Whether to hide from screen readers */
  'aria-hidden'?: boolean;
}

/**
 * ${functionName} icon component function
 * @param props Icon configuration options
 * @returns SVG string
 */
declare function ${functionName}(props?: IconProps): string;

export default ${functionName};
`;

    // Write .d.ts files to both ESM and CJS directories
    const esmDtsPath = path.join(esmDir, dtsFileName);
    const cjsDtsPath = path.join(cjsDir, dtsFileName);

    fs.writeFileSync(esmDtsPath, dtsContent, 'utf8');
    if (fs.existsSync(cjsDir)) {
      fs.writeFileSync(cjsDtsPath, dtsContent, 'utf8');
    }

    createdCount++;
  });

  console.log(`✅ Created ${createdCount} TypeScript definition files`);
  console.log(`📁 ESM definitions: ${path.join(esmDir, '*.d.ts')}`);
  if (fs.existsSync(cjsDir)) {
    console.log(`📁 CJS definitions: ${path.join(cjsDir, '*.d.ts')}`);
  }
}

/**
 * Main execution
 */
function main() {
  try {
    generateIndividualTypeDefinitions();
    console.log('🎉 Individual TypeScript definitions generated successfully!');
  } catch (error) {
    console.error('❌ Error generating TypeScript definitions:', error.message);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateIndividualTypeDefinitions };
