// optimize-icons.js
// Script to optimize SVGs with SVGO and update icons.json manifest

const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const ICONS_DIR = path.join(__dirname, 'sva-icons');
const MANIFEST = path.join(__dirname, 'icons.json');
const SVGO_CONFIG = path.join(__dirname, 'svgo.config.json');

function getTagsFromFilename(filename) {
  // Simple tag generator based on filename, can be improved
  return filename.replace('.svg', '').split(/[-_]/);
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
  files.forEach(filePath => {
    const svg = fs.readFileSync(filePath, 'utf8');
    const result = optimize(svg, { path: filePath, ...svgoConfig });
    fs.writeFileSync(filePath, result.data, 'utf8');
    console.log(`Optimized: ${path.relative(ICONS_DIR, filePath)}`);
  });
  return files;
}

function updateManifest(files) {
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
    return {
      name,
      filename,
      tags: manifestMap[filename]?.tags || getTagsFromFilename(filename)
    };
  });
  fs.writeFileSync(MANIFEST, JSON.stringify(newManifest, null, 2), 'utf8');
  console.log('icons.json updated.');
}

function main() {
  const files = optimizeSVGs();
  updateManifest(files);
}

main();
