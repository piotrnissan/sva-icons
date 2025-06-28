#!/usr/bin/env node

/**
 * Creates package.json files in CJS directories to ensure proper CommonJS module resolution
 * This fixes the issue where CJS files are treated as ES modules due to "type": "module" in root package.json
 */

import fs from 'fs';
import path from 'path';

const cjsPackageJson = {
  "type": "commonjs"
};

const cjsDirectories = [
  'dist/icons/cjs',
  'dist/react/cjs'
];

function createCjsPackageJson() {
  console.log('🔧 Creating package.json files for CJS directories...\n');

  cjsDirectories.forEach(dir => {
    const dirPath = path.resolve(dir);
    const packageJsonPath = path.join(dirPath, 'package.json');

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
      return;
    }

    try {
      // Write package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(cjsPackageJson, null, 2));
      console.log(`✅ Created ${packageJsonPath}`);
    } catch (error) {
      console.error(`❌ Failed to create ${packageJsonPath}:`, error.message);
    }
  });

  console.log('\n✨ CJS package.json files created successfully!');
}

createCjsPackageJson();
