// build-icons.js: Export all SVGs as ESM, CJS, and vanilla JS index
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const iconsDir = path.join(projectRoot, 'svg');
const outEsm = path.join(projectRoot, 'dist', 'icons', 'esm');
const outCjs = path.join(projectRoot, 'dist', 'icons', 'cjs');
const outIndex = path.join(projectRoot, 'dist', 'icons', 'index.js');

fs.mkdirSync(outEsm, { recursive: true });
fs.mkdirSync(outCjs, { recursive: true });

const icons = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));
const indexExports = [];

icons.forEach(file => {
  const name = path.basename(file, '.svg');
  const svg = fs.readFileSync(path.join(iconsDir, file), 'utf8').replace(/`/g, '\`');
  // ESM
  fs.writeFileSync(path.join(outEsm, name + '.js'), `export default \
\`${svg}\`\n`);
  // CJS
  fs.writeFileSync(path.join(outCjs, name + '.js'), `module.exports = \
\`${svg}\`\n`);
  // Index export
  indexExports.push(`exports['${name}'] = \
\`${svg}\`;
`);
});

fs.writeFileSync(outIndex, indexExports.join(''));
console.log('Icon ESM/CJS/vanilla exports generated.');
