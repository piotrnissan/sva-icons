// build-class-based.js: Build script for SVA Icons Class-Based API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const srcDir = path.join(projectRoot, 'src', 'class-based');
const outDir = path.join(projectRoot, 'dist', 'class-based');
const outEsm = path.join(outDir, 'esm');
const outCjs = path.join(outDir, 'cjs');

// Create output directories
console.log('🏗️  Creating output directories...');
fs.mkdirSync(outEsm, { recursive: true });
fs.mkdirSync(outCjs, { recursive: true });

// Module files to build
const modules = [
  'scanner.js',
  'injector.js', 
  'resolver.js',
  'observer.js',
  'performance.js',
  'bundles.js',
  'accessibility.js',
  'index.js'
];

console.log('📦 Building Class-Based API modules...');

// Build each module for ESM and CJS
modules.forEach(module => {
  const srcFile = path.join(srcDir, module);
  
  if (!fs.existsSync(srcFile)) {
    console.warn(`⚠️  Warning: ${module} not found, skipping...`);
    return;
  }
  
  const content = fs.readFileSync(srcFile, 'utf8');
  
  // Build ESM version (minimal changes needed)
  const esmContent = content
    .replace(/\/\*\* @preserve \*\//g, '') // Remove build comments
    .replace(/\s+\/\/ Development helpers[\s\S]*?\/\/ End development helpers/g, ''); // Remove dev code
  
  fs.writeFileSync(path.join(outEsm, module), esmContent);
  
  // Build CJS version (convert imports/exports)
  let cjsContent = esmContent
    // Convert named imports 
    .replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/g, 
      'const { $1 } = require(\'$2\')')
    // Convert default imports
    .replace(/import\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g, 
      'const $1 = require(\'$2\')')
    // Convert export default
    .replace(/export\s+default\s+/g, 'module.exports = ')
    // Convert named exports
    .replace(/export\s*\{\s*([^}]+)\s*\}/g, (match, exports) => {
      const exportList = exports.split(',').map(e => e.trim());
      return exportList.map(exp => `module.exports.${exp} = ${exp};`).join('\n');
    })
    // Convert export const/function/class
    .replace(/export\s+(const|function|class)\s+(\w+)/g, (match, type, name) => {
      return `${type} ${name}`;
    });
  
  // Add module.exports for exported items in CJS
  const exportMatches = content.match(/export\s+(const|function|class)\s+(\w+)/g);
  if (exportMatches) {
    const exports = exportMatches.map(match => {
      const name = match.match(/(\w+)$/)[1];
      return `module.exports.${name} = ${name};`;
    });
    cjsContent += '\n\n' + exports.join('\n');
  }
  
  fs.writeFileSync(path.join(outCjs, module), cjsContent);
  
  console.log(`✅ Built ${module} (ESM + CJS)`);
});

// Generate TypeScript definitions
console.log('📝 Generating TypeScript definitions...');

const typeDefinitions = `
// SVA Icons Class-Based API Type Definitions
// Generated automatically - do not edit manually

export interface SvaIconConfig {
  /** Default size for icons (default: '24px') */
  defaultSize?: string;
  /** Default color for icons (default: 'currentColor') */
  defaultColor?: string;
  /** Base path for SVG assets */
  basePath?: string;
  /** Enable/disable console logging */
  debug?: boolean;
  /** Performance monitoring options */
  performance?: {
    enabled?: boolean;
    batchSize?: number;
    cacheLimit?: number;
  };
  /** Accessibility options */
  accessibility?: {
    enabled?: boolean;
    autoAria?: boolean;
    focusManagement?: boolean;
  };
  /** Bundle configuration */
  bundles?: {
    enabled?: boolean;
    preload?: string[];
    lazy?: boolean;
  };
}

export interface SvaIconElement {
  element: HTMLElement;
  iconName: string;
  size?: string;
  color?: string;
  classList?: string[];
}

export interface PerformanceMetrics {
  iconsProcessed: number;
  totalTime: number;
  averageTime: number;
  cacheHits: number;
  cacheMisses: number;
  memoryUsage: number;
}

export interface BundleStats {
  loaded: string[];
  pending: string[];
  failed: string[];
  totalIcons: number;
}

export interface AccessibilityReport {
  totalElements: number;
  ariaLabeled: number;
  rolesAssigned: number;
  focusableElements: number;
  complianceScore: number;
}

/** Main class-based icon scanner */
export declare class SvaIconScanner {
  constructor(config?: SvaIconConfig);
  scan(): SvaIconElement[];
  scanElement(element: HTMLElement): SvaIconElement[];
  getConfig(): SvaIconConfig;
  updateConfig(config: Partial<SvaIconConfig>): void;
}

/** SVG injection engine */
export declare class SvaIconInjector {
  constructor(config?: SvaIconConfig);
  inject(elements: SvaIconElement[]): Promise<void>;
  injectSingle(element: SvaIconElement): Promise<void>;
  getStats(): { processed: number; successful: number; failed: number };
}

/** Icon path resolver */
export declare class SvaIconResolver {
  constructor(config?: SvaIconConfig);
  resolve(iconName: string): string;
  resolveWithBundle(iconName: string, bundle?: string): string;
  isValidIcon(iconName: string): boolean;
}

/** Mutation observer for dynamic content */
export declare class SvaIconObserver {
  constructor(config?: SvaIconConfig);
  observe(): void;
  disconnect(): void;
  isObserving(): boolean;
  getStats(): { mutations: number; iconsAdded: number; processingTime: number };
}

/** Performance optimization utilities */
export declare class SvaIconPerformance {
  constructor(config?: SvaIconConfig);
  enableMonitoring(): void;
  disableMonitoring(): void;
  getMetrics(): PerformanceMetrics;
  clearCache(): void;
  optimizeBatch(elements: SvaIconElement[]): SvaIconElement[];
}

/** Bundle management system */
export declare class SvaIconBundles {
  constructor(config?: SvaIconConfig);
  loadBundle(bundleName: string): Promise<boolean>;
  preloadBundles(bundles: string[]): Promise<void>;
  getBundleStats(): BundleStats;
  registerBundle(name: string, icons: string[]): void;
}

/** Accessibility enhancement system */
export declare class SvaIconAccessibility {
  constructor(config?: SvaIconConfig);
  enhanceElement(element: HTMLElement, iconName: string): void;
  enhanceElements(elements: SvaIconElement[]): void;
  getReport(): AccessibilityReport;
  validateCompliance(element: HTMLElement): boolean;
}

/** Main class-based API entry point */
export declare class SvaIcons {
  constructor(config?: SvaIconConfig);
  init(): void;
  scan(): SvaIconElement[];
  inject(): Promise<void>;
  observe(): void;
  stopObserving(): void;
  getPerformance(): PerformanceMetrics;
  getBundles(): BundleStats;
  getAccessibility(): AccessibilityReport;
  updateConfig(config: Partial<SvaIconConfig>): void;
}

/** Initialize with default configuration */
export declare function initSvaIcons(config?: SvaIconConfig): SvaIcons;

/** Default export */
declare const SvaIconsAPI: typeof SvaIcons;
export default SvaIconsAPI;
`;

fs.writeFileSync(path.join(outDir, 'index.d.ts'), typeDefinitions);
fs.writeFileSync(path.join(outEsm, 'index.d.ts'), typeDefinitions);
fs.writeFileSync(path.join(outCjs, 'index.d.ts'), typeDefinitions);

// Generate source maps (simplified - just references)
console.log('🗺️  Generating source maps...');
modules.forEach(module => {
  const mapContent = {
    version: 3,
    file: module,
    sourceRoot: '',
    sources: [`../../src/class-based/${module}`],
    names: [],
    mappings: ''
  };
  
  fs.writeFileSync(path.join(outEsm, module + '.map'), JSON.stringify(mapContent, null, 2));
  fs.writeFileSync(path.join(outCjs, module + '.map'), JSON.stringify(mapContent, null, 2));
});

// Build validation
console.log('✅ Validating build outputs...');
let validationErrors = 0;

modules.forEach(module => {
  const esmFile = path.join(outEsm, module);
  const cjsFile = path.join(outCjs, module);
  
  if (!fs.existsSync(esmFile)) {
    console.error(`❌ Missing ESM file: ${module}`);
    validationErrors++;
  }
  
  if (!fs.existsSync(cjsFile)) {
    console.error(`❌ Missing CJS file: ${module}`);
    validationErrors++;
  }
  
  // Basic syntax validation
  try {
    const esmContent = fs.readFileSync(esmFile, 'utf8');
    const cjsContent = fs.readFileSync(cjsFile, 'utf8');
    
    // Check for unconverted imports in CJS (ignore comments)
    if (cjsContent.includes('import ') && 
        !cjsContent.includes('// import') && 
        !cjsContent.includes('* import') &&
        !/\/\*[\s\S]*import[\s\S]*\*\//.test(cjsContent)) {
      console.warn(`⚠️  Warning: Unconverted imports in CJS ${module}`);
    }
    
    // Check for unconverted exports in CJS (ignore comments and module.exports)
    if (cjsContent.includes('export ') && 
        !cjsContent.includes('// export') && 
        !cjsContent.includes('* export') &&
        !cjsContent.includes('module.exports') &&
        !/\/\*[\s\S]*export[\s\S]*\*\//.test(cjsContent)) {
      console.warn(`⚠️  Warning: Unconverted exports in CJS ${module}`);
    }
    
  } catch (error) {
    console.error(`❌ Error reading ${module}: ${error.message}`);
    validationErrors++;
  }
});

// Generate build report
const buildReport = {
  timestamp: new Date().toISOString(),
  modules: modules.length,
  success: validationErrors === 0,
  errors: validationErrors,
  outputs: {
    esm: path.relative(projectRoot, outEsm),
    cjs: path.relative(projectRoot, outCjs),
    types: path.relative(projectRoot, path.join(outDir, 'index.d.ts'))
  }
};

fs.writeFileSync(
  path.join(outDir, 'build-report.json'), 
  JSON.stringify(buildReport, null, 2)
);

console.log('📊 Build Summary:');
console.log(`   Modules: ${modules.length}`);
console.log(`   ESM Output: ${path.relative(projectRoot, outEsm)}`);
console.log(`   CJS Output: ${path.relative(projectRoot, outCjs)}`);
console.log(`   TypeScript Definitions: Generated`);
console.log(`   Source Maps: Generated`);
console.log(`   Validation Errors: ${validationErrors}`);

if (validationErrors === 0) {
  console.log('🎉 Class-Based API build completed successfully!');
} else {
  console.error(`💥 Build completed with ${validationErrors} errors!`);
  process.exit(1);
}
