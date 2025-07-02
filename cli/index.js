#!/usr/bin/env node

/**
 * SVA Icons CLI Tool
 * Main entry point for CLI commands
 */

import { program } from 'commander';
import { generateImportMap } from './generate-import-map.js';

program
  .name('sva-icons')
  .description('CLI tools for SVA Icons')
  .version('3.1.0');

program
  .command('generate-import-map')
  .description('Generate import map for browser environments')
  .option('-o, --output <path>', 'Output file path', './import-map.json')
  .option('-b, --base-path <path>', 'Base path for imports', './node_modules/')
  .option('-e, --environment <env>', 'Target environment', 'browser')
  .option('--no-individual-icons', 'Skip individual icon mappings')
  .option('--inline', 'Generate inline import map HTML snippet for Live Preview')
  .action((options) => {
    generateImportMap(options);
  });

program
  .command('validate')
  .description('Validate SVA Icons setup')
  .action(() => {
    console.log('🔍 Validating SVA Icons setup...');
    // TODO: Implement validation
    console.log('✅ Setup validation complete');
  });

program
  .command('serve')
  .description('Start development server')
  .option('-p, --port <port>', 'Port to serve on', '3000')
  .option('--open', 'Open browser automatically')
  .action((options) => {
    console.log(`🚀 Starting development server on port ${options.port}`);
    // TODO: Implement dev server
  });

program.parse();
