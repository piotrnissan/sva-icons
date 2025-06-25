// optimize-icons.js
// Script to optimize SVGs with SVGO and update icons.json manifest

import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);
const ICONS_DIR = path.join(projectRoot, 'svg');
const MANIFEST = path.join(projectRoot, 'icons.json');
const SVGO_CONFIG = path.join(projectRoot, 'svgo.config.json');

// Enhanced categorization based on filename patterns
function getCategoryFromFilename(filename) {
  const name = filename.toLowerCase();
  
  // Automotive specific categories
  if (/battery|charging|fuel|engine|brake|oil|tyre|wheel/.test(name)) return 'automotive';
  if (/remote|control|key|unlock|lock/.test(name)) return 'remote-control';
  if (/climate|heating|cooling|temperature/.test(name)) return 'climate';
  if (/navigation|map|location|gps|direction/.test(name)) return 'navigation';
  if (/entertainment|music|radio|audio|video/.test(name)) return 'entertainment';
  
  // General UI categories
  if (/arrow|up|down|left|right|back|forward/.test(name)) return 'navigation-ui';
  if (/plus|minus|add|remove|delete|trash/.test(name)) return 'actions';
  if (/info|alert|warning|error|success|tick|cross/.test(name)) return 'status';
  if (/settings|gear|config|options/.test(name)) return 'settings';
  if (/search|filter|sort|view/.test(name)) return 'interface';
  if (/phone|email|message|contact|social/.test(name)) return 'communication';
  if (/calendar|clock|time|date/.test(name)) return 'time';
  if (/home|house|building|location/.test(name)) return 'places';
  if (/user|person|profile|account/.test(name)) return 'users';
  if (/document|file|pdf|download|upload/.test(name)) return 'files';
  if (/payment|money|price|cost|dollar|gbp|yen/.test(name)) return 'finance';
  
  return 'general';
}

function getTagsFromFilename(filename) {
  // Enhanced tag generator with better parsing
  const baseTags = filename.replace('.svg', '').split(/[-_\s]+/).filter(tag => tag.length > 0);
  const category = getCategoryFromFilename(filename);
  
  // Add category as a tag if it's not already included
  if (!baseTags.includes(category)) {
    baseTags.push(category);
  }
  
  return baseTags;
}

function getAllSvgFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllSvgFiles(filePath));
    } else if (file.endsWith('.svg')) {
      results.push(filePath);
    }
  });
  return results;
}

function optimizeSVGs() {
  const svgoConfig = JSON.parse(fs.readFileSync(SVGO_CONFIG, 'utf8'));
  const files = getAllSvgFiles(ICONS_DIR);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let optimizationStats = {
    totalFiles: files.length,
    categories: {},
    sizeSavings: 0,
    avgOptimization: 0
  };

  console.log(`🔧 Optimizing ${files.length} SVG files...`);
  console.log('─'.repeat(50));

  files.forEach((filePath, index) => {
    const originalSvg = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(originalSvg, 'utf8');
    
    const result = optimize(originalSvg, { path: filePath, ...svgoConfig });
    const optimizedSize = Buffer.byteLength(result.data, 'utf8');
    
    fs.writeFileSync(filePath, result.data, 'utf8');
    
    const savings = originalSize - optimizedSize;
    const percent = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : 0;
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
    
    const filename = path.relative(ICONS_DIR, filePath);
    const category = getCategoryFromFilename(filename);
    
    // Track category statistics
    if (!optimizationStats.categories[category]) {
      optimizationStats.categories[category] = { count: 0, savings: 0 };
    }
    optimizationStats.categories[category].count++;
    optimizationStats.categories[category].savings += savings;
    
    console.log(`✓ ${filename} | ${originalSize}B → ${optimizedSize}B | -${percent}%`);
  });
  
  optimizationStats.sizeSavings = totalOriginalSize - totalOptimizedSize;
  optimizationStats.avgOptimization = totalOriginalSize > 0 ? 
    ((optimizationStats.sizeSavings / totalOriginalSize) * 100).toFixed(1) : 0;

  // Print summary
  console.log('─'.repeat(50));
  console.log(`📊 Optimization Summary:`);
  console.log(`   Total files: ${optimizationStats.totalFiles}`);
  console.log(`   Original size: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
  console.log(`   Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`   Size savings: ${(optimizationStats.sizeSavings / 1024).toFixed(1)}KB (${optimizationStats.avgOptimization}%)`);
  console.log(`   Categories: ${Object.keys(optimizationStats.categories).length}`);
  
  return { files, stats: optimizationStats };
}

function updateManifest(files, stats) {
  let manifest = [];
  if (fs.existsSync(MANIFEST)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    } catch (e) {
      console.warn('Could not parse existing manifest, starting fresh.');
    }
  }
  
  const manifestMap = Object.fromEntries(manifest.map(i => [i.filename, i]));
  const newManifest = files.map(filePath => {
    const filename = path.relative(ICONS_DIR, filePath).replace(/\\/g, '/');
    const name = path.basename(filename, '.svg');
    const category = getCategoryFromFilename(filename);
    
    return {
      name,
      filename,
      category,
      tags: manifestMap[filename]?.tags || getTagsFromFilename(filename),
      size: fs.statSync(filePath).size,
      lastModified: fs.statSync(filePath).mtime.toISOString()
    };
  });
  
  // Add metadata to manifest
  const manifestWithMeta = {
    metadata: {
      version: "1.0.0",
      generated: new Date().toISOString(),
      totalIcons: newManifest.length,
      categories: Object.keys(stats.categories).sort(),
      stats: stats
    },
    icons: newManifest.sort((a, b) => a.name.localeCompare(b.name))
  };
  
  fs.writeFileSync(MANIFEST, JSON.stringify(manifestWithMeta, null, 2), 'utf8');
  console.log('✅ icons.json updated with enhanced metadata.');
  
  // Print category breakdown
  console.log('\n📂 Category Breakdown:');
  Object.entries(stats.categories)
    .sort(([,a], [,b]) => b.count - a.count)
    .forEach(([category, data]) => {
      console.log(`   ${category}: ${data.count} icons (${(data.savings / 1024).toFixed(1)}KB saved)`);
    });
}

function main() {
  console.log('🚀 SVA Icons Optimizer & Tracker');
  console.log('='.repeat(50));
  
  const { files, stats } = optimizeSVGs();
  updateManifest(files, stats);
  
  console.log('\n🎉 Optimization complete!');
}

main();
