#!/usr/bin/env node

/**
 * SVA Icons - Icon Name Validator
 * 
 * Validates icon names for potential JavaScript conflicts before building
 * Helps prevent issues with reserved words and invalid identifiers
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// JavaScript reserved words and built-in identifiers
const RESERVED_WORDS = new Set([
  // ES5 Reserved Words
  'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally',
  'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try',
  'typeof', 'var', 'void', 'while', 'with',
  
  // ES5 Strict Mode Reserved Words
  'class', 'const', 'enum', 'export', 'extends', 'import', 'super',
  
  // ES6+ Reserved Words
  'let', 'static', 'yield', 'await', 'async',
  
  // Future Reserved Words
  'implements', 'interface', 'package', 'private', 'protected', 'public',
  
  // Built-in Global Objects (common ones)
  'Array', 'Boolean', 'Date', 'Error', 'Function', 'JSON', 'Math', 'Number', 'Object', 'RegExp', 'String',
  'Symbol', 'console', 'window', 'document', 'undefined', 'null', 'NaN', 'Infinity',
  
  // Browser APIs (common ones that could conflict)
  'alert', 'confirm', 'prompt', 'setTimeout', 'setInterval', 'fetch', 'location', 'history', 'navigator'
]);

/**
 * Convert kebab-case filename to camelCase
 */
function toCamelCase(filename) {
  return filename
    .replace(/-([a-zA-Z0-9])/g, (match, letter) => letter.toUpperCase())
    .replace(/_([a-zA-Z0-9])/g, (match, letter) => letter.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[a-z]/, letter => letter.toLowerCase());
}

/**
 * Validate icon names and suggest fixes
 */
async function validateIconNames() {
  console.log('🔍 Validating icon names for JavaScript compatibility...\n');
  
  const svgDir = path.join(projectRoot, 'svg');
  const files = await fs.readdir(svgDir);
  const svgFiles = files.filter(file => file.endsWith('.svg'));
  
  let hasIssues = false;
  const issues = [];
  
  for (const file of svgFiles) {
    const filename = path.basename(file, '.svg');
    const camelName = toCamelCase(filename);
    
    // Check for reserved words
    if (RESERVED_WORDS.has(camelName)) {
      issues.push({
        type: 'reserved_word',
        filename,
        camelName,
        suggestion: camelName + 'Icon',
        severity: 'warning'
      });
    }
    
    // Check for invalid JavaScript identifiers
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(camelName)) {
      issues.push({
        type: 'invalid_identifier',
        filename,
        camelName,
        suggestion: 'Rename to use valid characters (letters and numbers only)',
        severity: 'error'
      });
    }
    
    // Check for names starting with numbers
    if (/^[0-9]/.test(camelName)) {
      issues.push({
        type: 'starts_with_number',
        filename,
        camelName,
        suggestion: 'icon' + camelName.charAt(0).toUpperCase() + camelName.slice(1),
        severity: 'warning'
      });
    }
  }
  
  // Report results
  if (issues.length === 0) {
    console.log('✅ All icon names are JavaScript-compatible!');
    console.log(`📊 Validated ${svgFiles.length} icons\n`);
    return true;
  }
  
  console.log(`⚠️  Found ${issues.length} potential issues:\n`);
  
  // Group by severity
  const errors = issues.filter(issue => issue.severity === 'error');
  const warnings = issues.filter(issue => issue.severity === 'warning');
  
  if (errors.length > 0) {
    console.log('❌ ERRORS (will cause build failures):');
    errors.forEach(issue => {
      console.log(`   • ${issue.filename}.svg → "${issue.camelName}"`);
      console.log(`     Issue: ${issue.type.replace(/_/g, ' ')}`);
      console.log(`     Fix: ${issue.suggestion}\n`);
    });
    hasIssues = true;
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (will be auto-fixed during build):');
    warnings.forEach(issue => {
      console.log(`   • ${issue.filename}.svg → "${issue.camelName}"`);
      console.log(`     Issue: ${issue.type.replace(/_/g, ' ')}`);
      console.log(`     Auto-fix: → "${issue.suggestion}"\n`);
    });
  }
  
  console.log('💡 RECOMMENDATIONS:');
  console.log('   • Rename problematic SVG files to avoid conflicts');
  console.log('   • Use kebab-case names (e.g., "my-icon.svg")');
  console.log('   • Avoid JavaScript reserved words');
  console.log('   • Start names with letters, not numbers\n');
  
  return !hasIssues; // Return false if there are errors
}

// Run validation
validateIconNames()
  .then(success => {
    if (!success) {
      console.log('❌ Validation failed. Please fix the errors above.');
      process.exit(1);
    }
    console.log('✅ Validation passed!');
  })
  .catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
