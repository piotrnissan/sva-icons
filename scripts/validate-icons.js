#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import the ProgressTracker from clean-dist.js (we'll reuse it)
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

class IconValidator {
  constructor() {
    this.tracker = new ProgressTracker('🔍 Icon Validation & Sync Analysis');
    this.svgPath = path.join(projectRoot, 'svg');
    this.distPath = path.join(projectRoot, 'dist');
    this.report = {
      timestamp: new Date().toISOString(),
      svg_icons: [],
      dist_icons: [],
      sync_status: 'unknown',
      missing_in_dist: [],
      extra_in_dist: [],
      mismatched: [],
      build_targets: [],
      recommendations: []
    };
  }

  async run(options = {}) {
    const { fix = false, verbose = false } = options;
    
    try {
      console.log('🔍 Starting Icon Validation & Sync Analysis...\n');
      
      const steps = [
        'Scan SVG source directory',
        'Scan dist build outputs', 
        'Analyze icon sync status',
        'Check build targets',
        'Generate recommendations',
        'Save validation report'
      ];
      
      this.tracker.setSteps(steps);
      
      // Step 1: Scan SVG directory
      this.tracker.startStep(0);
      await this.scanSvgDirectory();
      this.tracker.completeStep(0, `- found ${this.report.svg_icons.length} source icons `);
      
      // Step 2: Scan dist outputs
      this.tracker.startStep(1);
      await this.scanDistOutputs();
      this.tracker.completeStep(1, `- found ${this.report.dist_icons.length} built icons `);
      
      // Step 3: Analyze sync status
      this.tracker.startStep(2);
      await this.analyzeSyncStatus();
      this.tracker.completeStep(2, `- sync status: ${this.report.sync_status} `);
      
      // Step 4: Check build targets
      this.tracker.startStep(3);
      await this.checkBuildTargets();
      this.tracker.completeStep(3, `- checked ${this.report.build_targets.length} build targets `);
      
      // Step 5: Generate recommendations
      this.tracker.startStep(4);
      this.generateRecommendations();
      this.tracker.completeStep(4, `- ${this.report.recommendations.length} recommendations `);
      
      // Step 6: Save report
      this.tracker.startStep(5);
      await this.saveReport();
      this.tracker.completeStep(5, `- saved to validation-report.json `);
      
      const results = this.tracker.finish();
      this.printDetailedSummary();
      
      return this.report;
      
    } catch (error) {
      this.tracker.failStep(this.tracker.currentStep, error.message);
      console.error('❌ Validation failed:', error.message);
      throw error;
    }
  }

  async scanSvgDirectory() {
    try {
      const files = await fs.readdir(this.svgPath);
      const svgFiles = files.filter(file => file.endsWith('.svg') && file !== 'processed');
      
      for (const file of svgFiles) {
        const filePath = path.join(this.svgPath, file);
        const stats = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf8');
        
        this.report.svg_icons.push({
          name: file,
          baseName: file.replace('.svg', ''),
          path: filePath,
          size: stats.size,
          modified: stats.mtime,
          contentHash: this.generateContentHash(content)
        });
      }
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('   ⚠️  svg/ directory does not exist');
        return;
      }
      throw error;
    }
  }

  async scanDistOutputs() {
    const distDirs = [
      'icons/esm',
      'icons/cjs', 
      'class-based',
      'react',
      'web-components',
      'sprite'
    ];
    
    for (const dir of distDirs) {
      const dirPath = path.join(this.distPath, dir);
      try {
        const files = await fs.readdir(dirPath);
        const iconFiles = files.filter(file => 
          file.endsWith('.js') || 
          file.endsWith('.d.ts') || 
          file.endsWith('.css') ||
          file.endsWith('.svg')
        );
        
        for (const file of iconFiles) {
          const baseName = file.replace(/\.(js|d\.ts|css|svg)$/, '');
          if (!this.report.dist_icons.some(icon => icon.baseName === baseName && icon.buildTarget === dir)) {
            this.report.dist_icons.push({
              name: file,
              baseName: baseName,
              buildTarget: dir,
              path: path.join(dirPath, file)
            });
          }
        }
        
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.warn(`   ⚠️  Could not scan ${dir}:`, error.message);
        }
      }
    }
  }

  async analyzeSyncStatus() {
    const svgBaseNames = new Set(this.report.svg_icons.map(icon => icon.baseName));
    const distBaseNames = new Set(this.report.dist_icons.map(icon => icon.baseName));
    
    // Find missing icons in dist
    this.report.missing_in_dist = Array.from(svgBaseNames).filter(name => !distBaseNames.has(name));
    
    // Find extra icons in dist
    this.report.extra_in_dist = Array.from(distBaseNames).filter(name => !svgBaseNames.has(name));
    
    // Determine sync status
    if (this.report.missing_in_dist.length === 0 && this.report.extra_in_dist.length === 0) {
      this.report.sync_status = 'perfect';
    } else if (this.report.missing_in_dist.length === 0) {
      this.report.sync_status = 'extra_files';
    } else if (this.report.extra_in_dist.length === 0) {
      this.report.sync_status = 'missing_files';
    } else {
      this.report.sync_status = 'out_of_sync';
    }
  }

  async checkBuildTargets() {
    const expectedTargets = [
      { name: 'icons/esm', description: 'ES Module icon functions', required: true },
      { name: 'icons/cjs', description: 'CommonJS icon functions', required: true },
      { name: 'class-based', description: 'CSS class-based icons', required: true },
      { name: 'react', description: 'React components', required: false },
      { name: 'web-components', description: 'Web Components', required: false },
      { name: 'sprite', description: 'SVG sprite', required: false }
    ];
    
    for (const target of expectedTargets) {
      const targetPath = path.join(this.distPath, target.name);
      try {
        await fs.access(targetPath);
        const files = await fs.readdir(targetPath);
        const iconCount = files.filter(f => f.includes('.js') || f.includes('.css') || f.includes('.svg')).length;
        
        this.report.build_targets.push({
          ...target,
          exists: true,
          path: targetPath,
          iconCount: iconCount,
          status: iconCount > 0 ? 'populated' : 'empty'
        });
        
      } catch (error) {
        this.report.build_targets.push({
          ...target,
          exists: false,
          status: 'missing',
          error: error.message
        });
      }
    }
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Sync-related recommendations
    if (this.report.sync_status !== 'perfect') {
      if (this.report.missing_in_dist.length > 0) {
        recommendations.push({
          type: 'missing_files',
          priority: 'high',
          action: 'run_full_build',
          description: `${this.report.missing_in_dist.length} icons missing from dist/ - run full rebuild`,
          command: 'npm run update-icons --clean'
        });
      }
      
      if (this.report.extra_in_dist.length > 0) {
        recommendations.push({
          type: 'extra_files',
          priority: 'medium',
          action: 'clean_and_rebuild',
          description: `${this.report.extra_in_dist.length} extra icons in dist/ - clean and rebuild`,
          command: 'npm run clean && npm run build:all'
        });
      }
    }
    
    // Build target recommendations
    const missingTargets = this.report.build_targets.filter(t => !t.exists && t.required);
    if (missingTargets.length > 0) {
      recommendations.push({
        type: 'missing_build_targets',
        priority: 'high',
        action: 'full_rebuild',
        description: `Missing required build targets: ${missingTargets.map(t => t.name).join(', ')}`,
        command: 'npm run build:all'
      });
    }
    
    // Empty targets
    const emptyTargets = this.report.build_targets.filter(t => t.exists && t.status === 'empty');
    if (emptyTargets.length > 0) {
      recommendations.push({
        type: 'empty_build_targets',
        priority: 'medium',
        action: 'rebuild_specific',
        description: `Empty build targets detected: ${emptyTargets.map(t => t.name).join(', ')}`,
        command: 'npm run build:all'
      });
    }
    
    // Success state
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'info',
        action: 'none',
        description: '✅ All icons are perfectly synchronized!',
        command: null
      });
    }
    
    this.report.recommendations = recommendations;
  }

  async saveReport() {
    const reportPath = path.join(projectRoot, 'validation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.report, null, 2), 'utf8');
  }

  generateContentHash(content) {
    // Simple hash function for content comparison
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  printDetailedSummary() {
    console.log('\n📋 Validation Summary:');
    console.log(`   📁 SVG Icons: ${this.report.svg_icons.length} source files`);
    console.log(`   🏗️  Built Icons: ${this.report.dist_icons.length} output files`);
    console.log(`   🔄 Sync Status: ${this.getSyncStatusEmoji()} ${this.report.sync_status.toUpperCase()}`);
    
    if (this.report.missing_in_dist.length > 0) {
      console.log(`\n❌ Missing in dist/ (${this.report.missing_in_dist.length}):`);
      this.report.missing_in_dist.forEach(icon => console.log(`     - ${icon}`));
    }
    
    if (this.report.extra_in_dist.length > 0) {
      console.log(`\n⚠️  Extra in dist/ (${this.report.extra_in_dist.length}):`);
      this.report.extra_in_dist.slice(0, 10).forEach(icon => console.log(`     - ${icon}`));
      if (this.report.extra_in_dist.length > 10) {
        console.log(`     ... and ${this.report.extra_in_dist.length - 10} more`);
      }
    }
    
    console.log(`\n🏗️  Build Targets Status:`);
    this.report.build_targets.forEach(target => {
      const status = target.exists ? 
        (target.status === 'populated' ? '✅' : '⚠️ ') : '❌';
      console.log(`     ${status} ${target.name} - ${target.description} (${target.iconCount || 0} files)`);
    });
    
    console.log(`\n💡 Recommendations:`);
    this.report.recommendations.forEach(rec => {
      const emoji = rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : 'ℹ️';
      console.log(`     ${emoji} ${rec.description}`);
      if (rec.command) {
        console.log(`       Command: ${rec.command}`);
      }
    });
  }

  getSyncStatusEmoji() {
    switch (this.report.sync_status) {
      case 'perfect': return '✅';
      case 'extra_files': return '⚠️';
      case 'missing_files': return '❌';
      case 'out_of_sync': return '🚨';
      default: return '❓';
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix'),
  verbose: args.includes('--verbose'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  console.log(`
🔍 SVA Icons - Validation & Sync Analyzer

Usage:
  node scripts/validate-icons.js [options]

Options:
  --fix          Attempt to auto-fix sync issues (not implemented yet)
  --verbose      Show detailed output
  --help, -h     Show this help message

Examples:
  node scripts/validate-icons.js          # Check sync status
  node scripts/validate-icons.js --fix    # Check and attempt fixes
  node scripts/validate-icons.js --verbose # Detailed analysis

This script:
1. Scans svg/ directory for source icons
2. Scans dist/ directory for built outputs
3. Compares and identifies sync issues
4. Checks all build targets
5. Provides specific recommendations
6. Generates detailed validation report

Use this to ensure dist/ perfectly matches svg/ folder.
`);
  process.exit(0);
}

// Run the validator
const validator = new IconValidator();
validator.run(options).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
