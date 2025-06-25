// build-sprite.js: Generate SVG sprite from all icons
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const iconsDir = path.join(projectRoot, 'svg');
const outDir = path.join(projectRoot, 'dist', 'sprite');
const outFile = path.join(outDir, 'sva-icons-sprite.svg');

fs.mkdirSync(outDir, { recursive: true });

const icons = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

const symbols = icons.map(file => {
  const name = path.basename(file, '.svg');
  let svg = fs.readFileSync(path.join(iconsDir, file), 'utf8');
  // Remove outer <svg ...> and </svg>
  svg = svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
  return `<symbol id="icon-${name}" viewBox="0 0 24 24">${svg}</symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>\n`;
fs.writeFileSync(outFile, sprite);
console.log('SVG sprite generated:', outFile);
