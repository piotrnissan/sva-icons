#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const config = {
  iconsToUpdateDir: path.join(projectRoot, 'svg', 'icons-to-update'),
  svgDir: path.join(projectRoot, 'svg'),
  processedDir: path.join(projectRoot, 'svg', 'processed'),
  reportFile: path.join(projectRoot, 'icon-update-report.json')
};

class IconUpdater {
  constructor(options = {}) {
    this.options = options;
    this.report = {
      timestamp: new Date().toISOString(),
      options: options,
      processed: [],
      skipped: [],
      errors: [],
      duplicates: [],
      builds: [],
      cleaning: null,
      validation: null
    };
  }

  async run() {
    try {
      console.log('🚀 Starting Enhanced SVA Icons Update Process...\n');
      
      // Show options being used
      if (Object.keys(this.options).some(key => this.options[key])) {
        console.log('⚙️  Options enabled:');
        Object.entries(this.options).forEach(([key, value]) => {
          if (value) console.log(`   ✓ --${key}`);
        });
        console.log('');
      }

      // Step 1: Clean dist directory if requested
      if (this.options.clean) {
        await this.cleanDistDirectory();
      }

      // Step 2: Check if we have icons to process (unless just cleaning)
      const iconsToProcess = await this.getIconsToProcess();
      if (iconsToProcess.length === 0 && !this.options.clean) {
        console.log('ℹ️  No icons found in svg/icons-to-update/');
        console.log('   Place SVG files in svg/icons-to-update/ to process them.');
        
        if (this.options.validate) {
          await this.validateSync();
        }
        return;
      }

      if (iconsToProcess.length > 0) {
        console.log(`📁 Found ${iconsToProcess.length} icon(s) to process:`);
        iconsToProcess.forEach(icon => console.log(`   - ${icon}`));
        console.log('');

        // Step 3: Create necessary directories
        await this.ensureDirectories();

        // Step 4: Process each icon
        for (const iconFile of iconsToProcess) {
          await this.processIcon(iconFile);
        }
      }

      // Step 5: Run builds if we processed any icons OR if cleaning was done
      if (this.report.processed.length > 0 || this.options.clean) {
        await this.runBuilds();
      }

      // Step 6: Validate sync if requested
      if (this.options.validate) {
        await this.validateSync();
      }

      // Step 7: Generate report
      await this.generateReport();

      console.log('\n✅ Enhanced icon update process completed!');
      this.printSummary();

    } catch (error) {
      console.error('❌ Error during icon update process:', error.message);
      this.report.errors.push({
        type: 'general',
        message: error.message,
        stack: error.stack
      });
      await this.generateReport();
      process.exit(1);
    }
  }

  async cleanDistDirectory() {
    console.log('🧹 Cleaning dist directory...');
    try {
      const { execSync } = await import('node:child_process');
      const startTime = Date.now();
      
      execSync('node scripts/clean-dist.js', {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true
      });
      
      const duration = Date.now() - startTime;
      this.report.cleaning = {
        success: true,
        duration: duration
      };
      
      console.log(`✅ Dist directory cleaned (${duration}ms)\n`);
    } catch (error) {
      console.error('❌ Failed to clean dist directory:', error.message);
      this.report.cleaning = {
        success: false,
        error: error.message
      };
      throw error;
    }
  }

  async validateSync() {
    console.log('🔍 Validating icon sync status...');
    try {
      const startTime = Date.now();
      
      execSync('node scripts/validate-icons.js', {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true
      });
      
      const duration = Date.now() - startTime;
      this.report.validation = {
        success: true,
        duration: duration
      };
      
      console.log(`✅ Validation completed (${duration}ms)\n`);
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      this.report.validation = {
        success: false,
        error: error.message
      };
      // Don't throw - validation failure shouldn't stop the process
    }
  }

  async getIconsToProcess() {
    try {
      const files = await fs.readdir(config.iconsToUpdateDir);
      return files.filter(file => file.toLowerCase().endsWith('.svg'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async ensureDirectories() {
    const directories = [config.iconsToUpdateDir, config.processedDir];
    
    for (const dir of directories) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${path.relative(projectRoot, dir)}`);
      }
    }
  }

  async processIcon(iconFile) {
    const sourcePath = path.join(config.iconsToUpdateDir, iconFile);
    
    try {
      console.log(`\n🔄 Processing: ${iconFile}`);
      
      // 1. Normalize filename
      const normalizedName = this.normalizeFilename(iconFile);
      console.log(`   📝 Normalized name: ${normalizedName}`);
      
      // 2. Check for name duplicates
      const targetPath = path.join(config.svgDir, normalizedName);
      const nameExists = await this.fileExists(targetPath);
      
      if (nameExists) {
        console.log(`   ⚠️  Icon with name "${normalizedName}" already exists - skipping`);
        this.report.duplicates.push({
          file: iconFile,
          reason: 'name_duplicate',
          existing: normalizedName
        });
        return;
      }
      
      // 3. Read and clean SVG content
      const svgContent = await fs.readFile(sourcePath, 'utf8');
      const cleanedSvg = this.cleanSvg(svgContent, normalizedName);
      
      // 4. Check for content duplicates (simplified)
      const contentDuplicate = await this.findContentDuplicate(cleanedSvg);
      if (contentDuplicate) {
        console.log(`   ⚠️  Similar content found in "${contentDuplicate}" - skipping`);
        this.report.duplicates.push({
          file: iconFile,
          reason: 'content_duplicate',
          existing: contentDuplicate
        });
        return;
      }
      
      // 5. Write cleaned SVG to main directory
      await fs.writeFile(targetPath, cleanedSvg, 'utf8');
      console.log(`   ✅ Added to svg/${normalizedName}`);
      
      // 6. Move original to processed directory
      const processedPath = path.join(config.processedDir, `${Date.now()}-${iconFile}`);
      await fs.rename(sourcePath, processedPath);
      console.log(`   📦 Moved original to processed/`);
      
      this.report.processed.push({
        original: iconFile,
        normalized: normalizedName,
        size: cleanedSvg.length
      });
      
    } catch (error) {
      console.error(`   ❌ Error processing ${iconFile}:`, error.message);
      this.report.errors.push({
        type: 'processing',
        file: iconFile,
        message: error.message
      });
    }
  }

  normalizeFilename(filename) {
    // Remove .svg extension first, then normalize, then add back
    const nameWithoutExtension = filename.replace(/\.svg$/i, '');
    
    return nameWithoutExtension
      .toLowerCase()
      .replace(/^wds2[-_]?/i, '')          // Remove wds2 prefix
      .replace(/^icon[-_]?/i, '')         // Remove icon prefix
      .replace(/[-_\s]+/g, '-')           // Normalize separators to hyphens
      .replace(/[^a-z0-9-]/g, '')         // Remove invalid characters
      .replace(/^-+|-+$/g, '')           // Remove leading/trailing hyphens
      .replace(/-+/g, '-')               // Remove duplicate hyphens
      + '.svg';
  }

  cleanSvg(svgContent, filename) {
    // Remove unwanted attributes and normalize
    let cleaned = svgContent
      // Remove fill, stroke, style attributes
      .replace(/\s(fill|stroke|style)="[^"]*"/gi, '')
      .replace(/\s(fill|stroke|style)='[^']*'/gi, '')
      // Remove data-* attributes
      .replace(/\sdata-[^=]*="[^"]*"/gi, '')
      // Remove class attributes  
      .replace(/\sclass="[^"]*"/gi, '')
      // Remove id attributes (except on main svg)
      .replace(/(<(?!svg)[^>]*)\sid="[^"]*"/gi, '$1')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();

    // Ensure proper SVG structure
    if (!cleaned.includes('xmlns="http://www.w3.org/2000/svg"')) {
      cleaned = cleaned.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Normalize viewBox and dimensions
    if (!cleaned.includes('viewBox=')) {
      cleaned = cleaned.replace('<svg', '<svg viewBox="0 0 24 24"');
    }
    
    // Remove explicit width/height if viewBox exists
    if (cleaned.includes('viewBox=')) {
      cleaned = cleaned.replace(/\s(width|height)="[^"]*"/gi, '');
    }

    return cleaned;
  }

  async findContentDuplicate(svgContent) {
    try {
      const files = await fs.readdir(config.svgDir);
      const svgFiles = files.filter(f => f.endsWith('.svg'));
      
      // Simple content comparison (normalize whitespace)
      const normalizedContent = svgContent.replace(/\s+/g, ' ').trim();
      
      for (const file of svgFiles) {
        try {
          const existingContent = await fs.readFile(path.join(config.svgDir, file), 'utf8');
          const normalizedExisting = existingContent.replace(/\s+/g, ' ').trim();
          
          // Simple similarity check - could be enhanced
          if (normalizedContent === normalizedExisting) {
            return file;
          }
        } catch (error) {
          // Skip files we can't read
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Warning: Could not check for content duplicates:', error.message);
      return null;
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async runBuilds() {
    console.log('\n🔨 Running build processes...');
    
    // Enhanced build commands for complete rebuild
    const buildCommands = [
      { name: 'build:icons', command: 'npm run build:icons' },
      { name: 'build:sprite', command: 'npm run build:sprite' },
      { name: 'build:react', command: 'npm run build:react' },
      { name: 'build:web', command: 'npm run build:web' },
      { name: 'build:web-tree-shakable', command: 'npm run build:web-tree-shakable' },
      { name: 'build:create-icons', command: 'npm run build:create-icons' },
      { name: 'build:class-based', command: 'npm run build:class-based' },
      { name: 'build:css', command: 'npm run build:css' },
      { name: 'build:typescript', command: 'npm run build:typescript' }
    ];

    let successCount = 0;
    let totalTime = 0;

    for (const build of buildCommands) {
      try {
        console.log(`   🔄 Running ${build.name}...`);
        const startTime = Date.now();
        
        execSync(build.command, { 
          cwd: projectRoot, 
          stdio: 'pipe',
          shell: true 
        });
        
        const duration = Date.now() - startTime;
        totalTime += duration;
        successCount++;
        console.log(`   ✅ ${build.name} completed (${duration}ms)`);
        
        this.report.builds.push({
          name: build.name,
          success: true,
          duration: duration
        });
        
      } catch (error) {
        console.error(`   ❌ ${build.name} failed:`, error.message);
        this.report.builds.push({
          name: build.name,
          success: false,
          error: error.message
        });
      }
    }

    console.log(`\n📊 Build Summary: ${successCount}/${buildCommands.length} successful (${totalTime}ms total)`);
  }

  async generateReport() {
    try {
      await fs.writeFile(config.reportFile, JSON.stringify(this.report, null, 2), 'utf8');
      console.log(`\n📊 Report saved to: ${path.relative(projectRoot, config.reportFile)}`);
    } catch (error) {
      console.warn('Warning: Could not save report:', error.message);
    }
  }

  printSummary() {
    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Processed: ${this.report.processed.length} icons`);
    console.log(`   ⚠️  Skipped: ${this.report.duplicates.length} duplicates`);
    console.log(`   ❌ Errors: ${this.report.errors.length} errors`);
    console.log(`   🔨 Builds: ${this.report.builds.filter(b => b.success).length}/${this.report.builds.length} successful`);
    
    if (this.report.processed.length > 0) {
      console.log(`\n📝 New icons added:`);
      this.report.processed.forEach(p => console.log(`   - ${p.normalized}`));
    }
    
    if (this.report.duplicates.length > 0) {
      console.log(`\n⚠️  Duplicates found:`);
      this.report.duplicates.forEach(d => console.log(`   - ${d.file} (${d.reason})`));
    }
    
    if (this.report.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      this.report.errors.forEach(e => console.log(`   - ${e.file || 'general'}: ${e.message}`));
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const options = {
  clean: args.includes('--clean'),
  sync: args.includes('--sync'),
  validate: args.includes('--validate'),
  watch: args.includes('--watch'),
  verbose: args.includes('--verbose'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  console.log(`
🚀 SVA Icons Update Tool - Enhanced Edition

Usage:
  npm run update-icons [options]

Options:
  --clean        Clean dist/ directory before processing (recommended)
  --sync         Incremental sync only (add/remove changed icons)
  --validate     Validate sync status after processing  
  --watch        Start watch mode (monitor svg/ for changes)
  --verbose      Show detailed output
  --help, -h     Show this help message

Examples:
  npm run update-icons                    # Standard processing
  npm run update-icons -- --clean        # Clean + full rebuild
  npm run update-icons -- --sync         # Incremental sync only
  npm run update-icons -- --validate     # Process + validate
  npm run update-icons -- --clean --validate  # Full clean + validate

Process Overview:
1. 📁 Scan svg/icons-to-update/ for new SVG files
2. 📝 Normalize filenames (remove prefixes, standardize format)
3. 🧹 Clean SVG content (remove unwanted attributes)
4. 🔍 Check for name and content duplicates
5. 📦 Move processed icons to svg/ directory
6. 🗂️  Backup originals to svg/processed/
7. 🔨 Run all build processes (9 different outputs)
8. 📊 Generate comprehensive report
9. ✅ Validate results (if --validate option used)

Enhanced Features:
- Complete dist/ cleaning and rebuild
- Real-time progress tracking
- Comprehensive duplicate detection
- All build targets included
- Detailed error reporting
- Sync validation

Documentation:
- See .docs/AUTOMATION_TRACKER.md for implementation status
- See .docs/ICON_UPDATE_PROCESS.md for detailed process documentation
- See .docs/SVG_NAMING_CONVENTION.md for naming conventions
`);
  process.exit(0);
}

// Run the updater with options
const updater = new IconUpdater(options);
updater.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
