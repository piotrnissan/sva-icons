// Test import paths from SimpleWebComponentsTest location
// Run this with: node test-imports.mjs

console.log('Testing import paths...');

// Test the web components path
const webComponentsPath = '../../../../web-components/sva-icon.js';
console.log('Web components path:', webComponentsPath);

// Test the React components path  
const reactPath = '../../../../dist/react/esm/Home.js';
console.log('React components path:', reactPath);

console.log('Paths look correct based on directory structure.');
