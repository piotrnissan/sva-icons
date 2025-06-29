#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Progress tracking
class ProgressTracker {
  constructor(taskName) {
    this.taskName = taskName;
    this.startTime = Date.now();
    this.steps = [];
    this.currentStep = 0;
    this.totalSteps = 0;
  }

  setSteps(steps) {
    this.totalSteps = steps.length;
    this.steps = steps.map(step => ({ name: step, status: 'pending', startTime: null, duration: null }));
    console.log(`\n🎯 ${this.taskName} - ${this.totalSteps} steps planned`);
    this.printProgress();
  }

  startStep(stepIndex) {
    this.currentStep = stepIndex;
    this.steps[stepIndex].status = 'running';
    this.steps[stepIndex].startTime = Date.now();
    this.printProgress();
  }

  completeStep(stepIndex, details = '') {
    const step = this.steps[stepIndex];
    step.status = 'completed';
    step.duration = Date.now() - step.startTime;
    console.log(`   ✅ ${step.name} ${details}(${step.duration}ms)`);
    this.printProgress();
  }

  failStep(stepIndex, error) {
    const step = this.steps[stepIndex];
    step.status = 'failed';
    step.error = error;
    console.log(`   ❌ ${step.name} - ${error}`);
    this.printProgress();
  }

  printProgress() {
    const completed = this.steps.filter(s => s.status === 'completed').length;
    const failed = this.steps.filter(s => s.status === 'failed').length;
    const running = this.steps.filter(s => s.status === 'running').length;
    
    const progressBar = this.generateProgressBar(completed, this.totalSteps);
    console.log(`📊 Progress: ${progressBar} ${completed}/${this.totalSteps} (${failed} failed, ${running} running)`);
  }

  generateProgressBar(current, total, width = 20) {
    const filled = Math.round((current / total) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }

  finish() {
    const totalDuration = Date.now() - this.startTime;
    const completed = this.steps.filter(s => s.status === 'completed').length;
    const failed = this.steps.filter(s => s.status === 'failed').length;
    
    console.log(`\n🏁 ${this.taskName} completed in ${totalDuration}ms`);
    console.log(`   ✅ ${completed} steps completed`);
    if (failed > 0) {
      console.log(`   ❌ ${failed} steps failed`);
    }
    
    return { completed, failed, totalDuration };
  }
}

class DistCleaner {
  constructor() {
    this.tracker = new ProgressTracker('🧹 Clean Dist Directory');
    this.distPath = path.join(projectRoot, 'dist');
    this.backupPath = path.join(projectRoot, '.backup-dist');
    this.report = {
      timestamp: new Date().toISOString(),
      cleaned: [],
      backed_up: [],
      errors: [],
      summary: {}
    };
  }

  async run(options = {}) {
    const { backup = true, verbose = false } = options;
    
    try {
      console.log('🧹 Starting Dist Directory Cleanup...\n');
      
      const steps = [
        'Scan dist directory',
        backup ? 'Create backup' : 'Skip backup',
        'Remove dist contents',
        'Verify cleanup',
        'Generate report'
      ].filter(Boolean);
      
      this.tracker.setSteps(steps);
      
      // Step 1: Scan dist directory
      this.tracker.startStep(0);
      const distContents = await this.scanDistDirectory();
      this.tracker.completeStep(0, `- found ${distContents.length} items `);
      
      // Step 2: Create backup (optional)
      if (backup) {
        this.tracker.startStep(1);
        await this.createBackup(distContents);
        this.tracker.completeStep(1, `- backed up to .backup-dist `);
      }
      
      // Step 3: Remove dist contents
      this.tracker.startStep(backup ? 2 : 1);
      await this.cleanDistDirectory(distContents);
      this.tracker.completeStep(backup ? 2 : 1, `- removed ${this.report.cleaned.length} items `);
      
      // Step 4: Verify cleanup
      this.tracker.startStep(backup ? 3 : 2);
      const verification = await this.verifyCleanup();
      this.tracker.completeStep(backup ? 3 : 2, `- ${verification.remaining} items remaining `);
      
      // Step 5: Generate report
      this.tracker.startStep(backup ? 4 : 3);
      await this.generateReport();
      this.tracker.completeStep(backup ? 4 : 3, `- saved to clean-report.json `);
      
      const results = this.tracker.finish();
      this.printSummary();
      
      return this.report;
      
    } catch (error) {
      this.tracker.failStep(this.tracker.currentStep, error.message);
      console.error('❌ Cleanup failed:', error.message);
      throw error;
    }
  }

  async scanDistDirectory() {
    try {
      const items = await fs.readdir(this.distPath, { withFileTypes: true });
      return items.map(item => ({
        name: item.name,
        path: path.join(this.distPath, item.name),
        isDirectory: item.isDirectory(),
        size: 0 // Will be calculated during processing
      }));
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('   ℹ️  dist/ directory does not exist - nothing to clean');
        return [];
      }
      throw error;
    }
  }

  async createBackup(items) {
    if (items.length === 0) return;
    
    try {
      // Remove old backup if exists
      try {
        await fs.rm(this.backupPath, { recursive: true, force: true });
      } catch (error) {
        // Ignore if backup doesn't exist
      }
      
      // Create new backup
      await fs.mkdir(this.backupPath, { recursive: true });
      
      for (const item of items) {
        const backupItemPath = path.join(this.backupPath, item.name);
        try {
          if (item.isDirectory) {
            await fs.cp(item.path, backupItemPath, { recursive: true });
          } else {
            await fs.copyFile(item.path, backupItemPath);
          }
          this.report.backed_up.push(item.name);
        } catch (error) {
          this.report.errors.push({
            type: 'backup',
            item: item.name,
            error: error.message
          });
        }
      }
      
    } catch (error) {
      console.warn('⚠️  Backup failed:', error.message);
      this.report.errors.push({
        type: 'backup',
        error: error.message
      });
    }
  }

  async cleanDistDirectory(items) {
    if (items.length === 0) return;
    
    // First, attempt to fix OneDrive permission issues
    await this.fixOneDrivePermissions();
    
    for (const item of items) {
      try {
        await fs.rm(item.path, { recursive: true, force: true });
        this.report.cleaned.push(item.name);
        console.log(`     🗑️  Removed: ${item.name}`);
      } catch (error) {
        console.error(`     ❌ Failed to remove ${item.name}:`, error.message);
        this.report.errors.push({
          type: 'cleanup',
          item: item.name,
          error: error.message
        });
      }
    }
  }

  async fixOneDrivePermissions() {
    try {
      console.log(`     🔧 Fixing OneDrive permissions...`);
      
      // Use PowerShell to remove ReadOnly attributes
      const { execSync } = await import('node:child_process');
      execSync('attrib -R -S -H * /S /D', { 
        cwd: this.distPath,
        stdio: 'pipe',
        shell: true 
      });
      
      console.log(`     ✅ OneDrive permissions fixed`);
    } catch (error) {
      console.log(`     ⚠️  Could not fix OneDrive permissions: ${error.message}`);
      // Continue anyway - maybe it's not needed
    }
  }

  async verifyCleanup() {
    try {
      const remaining = await fs.readdir(this.distPath);
      return {
        success: remaining.length === 0,
        remaining: remaining.length,
        items: remaining
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { success: true, remaining: 0, items: [] };
      }
      throw error;
    }
  }

  async generateReport() {
    this.report.summary = {
      items_scanned: this.report.cleaned.length + this.report.errors.filter(e => e.type === 'cleanup').length,
      items_cleaned: this.report.cleaned.length,
      items_backed_up: this.report.backed_up.length,
      errors_count: this.report.errors.length,
      backup_location: this.backupPath
    };
    
    const reportPath = path.join(projectRoot, 'clean-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.report, null, 2), 'utf8');
  }

  printSummary() {
    console.log('\n📋 Cleanup Summary:');
    console.log(`   🗑️  Cleaned: ${this.report.cleaned.length} items`);
    console.log(`   📦 Backed up: ${this.report.backed_up.length} items`);
    console.log(`   ❌ Errors: ${this.report.errors.length} errors`);
    
    if (this.report.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      this.report.errors.forEach(error => {
        console.log(`     - ${error.item || 'general'}: ${error.error}`);
      });
    }
    
    if (this.report.backed_up.length > 0) {
      console.log(`\n📦 Backup saved to: ${path.relative(projectRoot, this.backupPath)}`);
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const options = {
  backup: !args.includes('--no-backup'),
  verbose: args.includes('--verbose'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  console.log(`
🧹 SVA Icons - Dist Directory Cleaner

Usage:
  node scripts/clean-dist.js [options]

Options:
  --no-backup    Skip creating backup of dist/ directory
  --verbose      Show detailed output
  --help, -h     Show this help message

Examples:
  node scripts/clean-dist.js              # Clean with backup
  node scripts/clean-dist.js --no-backup  # Clean without backup
  node scripts/clean-dist.js --verbose    # Clean with detailed output

This script:
1. Scans the dist/ directory
2. Creates a backup in .backup-dist/ (unless --no-backup)
3. Removes all contents from dist/
4. Verifies cleanup was successful
5. Generates a detailed report

The dist/ directory will be completely empty after running this script,
ready for a fresh rebuild of all icon outputs.
`);
  process.exit(0);
}

// Run the cleaner
const cleaner = new DistCleaner();
cleaner.run(options).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
