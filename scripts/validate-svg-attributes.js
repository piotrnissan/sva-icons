#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);
const svgDir = path.join(projectRoot, 'svg');

function getAllSvgFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.svg'))
    .map(f => path.join(dir, f));
}

function validate() {
  const files = fs.existsSync(svgDir) ? getAllSvgFiles(svgDir) : [];
  const issues = [];

  const strokeRe = /\bstroke\s*=|stroke-width\s*=|style\s*=\"[^\"]*stroke\s*:/i;
  const disallowedFillRe = /\bfill\s*=\"(?!none\b)[^\"]+\"/i;
  const gradientPatternRe = /<(linearGradient|radialGradient|pattern)\b/i;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    if (strokeRe.test(content)) {
      issues.push({ file, type: 'stroke', msg: 'Stroke usage detected' });
    }
    if (disallowedFillRe.test(content)) {
      issues.push({ file, type: 'fill', msg: 'Hard-coded fill detected (only fill="none" allowed)' });
    }
    if (gradientPatternRe.test(content)) {
      issues.push({ file, type: 'paint', msg: 'Gradient/pattern detected (not allowed)' });
    }
  }

  if (issues.length) {
    console.error('❌ SVG attribute validation failed:\n');
    for (const { file, type, msg } of issues) {
      console.error(` - [${type}] ${path.relative(projectRoot, file)} → ${msg}`);
    }
    process.exit(1);
  } else {
    console.log(`✅ SVG attribute validation passed (${files.length} files checked)`);
  }
}

validate();
