// Node integrity test: compare source SVG vs generated ESM output
// - Ensures multi-path preservation
// - Enforces single-color theming and no-stroke policy
// - Preserves viewBox and key attributes (fill-rule/clip-rule/transform/opacity)

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const SRC_DIR = path.join(projectRoot, 'svg');
const ESM_DIR = path.join(projectRoot, 'dist', 'icons', 'esm');

const ICONS = [
  'book-service',
  'battery',
  'car'
];

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function count(regex, str) {
  const m = str.match(regex);
  return m ? m.length : 0;
}

function getAttr(attr, str) {
  const m = str.match(new RegExp(`${attr}="([^"]+)"`, 'i'));
  return m ? m[1] : null;
}

function has(regex, str) {
  return regex.test(str);
}

function normalize(s) {
  return s.replace(/\s+/g, ' ').trim();
}

async function importEsmFunction(iconName) {
  const filePath = path.join(ESM_DIR, `${iconName}.js`);
  const modUrl = pathToFileURL(filePath).href;
  const mod = await import(modUrl);
  return mod.default || mod[Object.keys(mod)[0]];
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

async function testIcon(icon) {
  const srcPath = path.join(SRC_DIR, `${icon}.svg`);
  const distPath = path.join(ESM_DIR, `${icon}.js`);

  assert(fs.existsSync(srcPath), `Source SVG missing: ${srcPath}`);
  assert(fs.existsSync(distPath), `Generated ESM missing: ${distPath}`);

  const src = readFile(srcPath);

  const viewBoxSrc = getAttr('viewBox', src) || '0 0 24 24';
  const srcPathCount = count(/<path\b[^>]*>/gi, src);
  const srcHasFillRule = has(/fill-rule="evenodd"/i, src);
  const srcHasClipRule = has(/clip-rule="evenodd"/i, src);

  const IconFn = await importEsmFunction(icon);
  const out = IconFn({});
  assert(typeof out === 'string', `Icon function did not return string for ${icon}`);

  const outViewBox = getAttr('viewBox', out);
  const outPathCount = count(/<path\b[^>]*>/gi, out);

  // Multi-path parity
  assert(outPathCount === srcPathCount, `${icon}: path count mismatch (src=${srcPathCount}, out=${outPathCount})`);

  // ViewBox preserved
  assert(outViewBox === viewBoxSrc, `${icon}: viewBox mismatch (src=${viewBoxSrc}, out=${outViewBox})`);

  // Theming/no-stroke constraints
  // No stroke except svg-level stroke="none"
  const invalidStroke = /\bstroke="(?!none\b)[^"]*"/i.test(out);
  assert(!invalidStroke, `${icon}: invalid stroke detected in output`);

  const hasStrokeWidth = /\bstroke-width\s*=\s*"[^"]*"/i.test(out);
  assert(!hasStrokeWidth, `${icon}: stroke-width detected in output`);

  // No path-level fill other than fill="none"
  // Look for fill on path elements specifically
  const pathFillMatches = out.match(/<path\b[^>]*\bfill="([^"]+)"[^>]*>/gi) || [];
  const badPathFills = pathFillMatches.filter(m => !/fill="none"/i.test(m));
  assert(badPathFills.length === 0, `${icon}: path-level fill detected that is not 'none'`);

  // Preserve rules
  if (srcHasFillRule) {
    assert(/fill-rule="evenodd"/i.test(out), `${icon}: missing fill-rule='evenodd' in output`);
  }
  if (srcHasClipRule) {
    assert(/clip-rule="evenodd"/i.test(out), `${icon}: missing clip-rule='evenodd' in output`);
  }

  // Sanity: output has outer svg and inner content
  assert(/<svg\b[^>]*>/.test(out) && /<\/svg>/.test(out), `${icon}: invalid SVG wrapper`);
}

async function main() {
  try {
    for (const icon of ICONS) {
      await testIcon(icon);
      console.log(`✅ ${icon} passed integrity checks`);
    }
    console.log('🎉 All integrity checks passed');
  } catch (e) {
    console.error('❌ Integrity test failed:', e.message);
    process.exit(1);
  }
}

main();
