#!/usr/bin/env node
// Quick debug script to check alias filtering

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const esmDir = path.join(projectRoot, 'dist', 'icons', 'esm');

function toPascalCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/(?:^|\s)(\w)/g, (_, char) => char.toUpperCase())
    .replace(/\s/g, '');
}

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

const iconFiles = getIconFiles(esmDir);
const existingExports = iconFiles.map(toPascalCase);

const commonAliases = [
  { name: 'Close', file: 'cross' },
  { name: 'Check', file: 'tick' }
];

console.log('🔍 Debug Alias Filtering:');
console.log('📁 Icon files count:', iconFiles.length);
console.log('📋 Sample files:', iconFiles.slice(0, 10));
console.log('\n🎯 Checking aliases:');

commonAliases.forEach(alias => {
  const fileExists = iconFiles.includes(alias.file);
  const nameExists = existingExports.includes(alias.name);
  const isValid = fileExists && !nameExists;
  
  console.log(`\n📌 ${alias.name} → ${alias.file}`);
  console.log(`   File exists: ${fileExists}`);
  console.log(`   Name exists: ${nameExists}`);
  console.log(`   Valid alias: ${isValid}`);
  
  if (!fileExists) {
    console.log(`   ❌ File "${alias.file}" not found in:`, iconFiles.filter(f => f.includes(alias.file.substring(0, 4))));
  }
  
  if (nameExists) {
    console.log(`   ❌ Name "${alias.name}" already exists as export`);
  }
});

const validAliases = commonAliases.filter(alias => 
  iconFiles.includes(alias.file) && !existingExports.includes(alias.name)
);

console.log('\n✅ Valid aliases:', validAliases.length);
validAliases.forEach(alias => {
  console.log(`   ${alias.name} → ${alias.file}`);
});
