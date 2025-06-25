#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);
const docsDir = join(rootDir, 'docs');

console.log('🚀 Deploying documentation...');

try {
  // Navigate to docs directory and install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { cwd: docsDir, stdio: 'inherit' });
  
  // Build the documentation
  console.log('🔨 Building documentation...');
  execSync('npm run build', { cwd: docsDir, stdio: 'inherit' });
  
  // Deploy to GitHub Pages (requires gh-pages package)
  console.log('📤 Deploying to GitHub Pages...');
  execSync('npm run deploy:gh-pages', { cwd: docsDir, stdio: 'inherit' });
  
  console.log('✅ Documentation deployed successfully!');
  console.log('🌐 Visit: https://nissan.github.io/sva-icons');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
