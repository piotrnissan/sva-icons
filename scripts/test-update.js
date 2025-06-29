#!/usr/bin/env node

/**
 * SVA Icons Update Script - Test Version
 */

import fs from 'fs';

console.log('✅ Script is working!');
console.log('Node.js version:', process.version);
console.log('Arguments:', process.argv.slice(2));

if (process.argv.includes('--help')) {
    console.log('This is the help message');
}
