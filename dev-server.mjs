/**
 * Simple development server for SVA Icons testing
 * Serves files with proper MIME types and module resolution
 * Adapted from SVA Framework dev-server
 */

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = __dirname; // SVA Icons project root

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

const server = createServer(async (req, res) => {
  try {
    // Remove query parameters and decode URL
    let filePath = req.url.split('?')[0];
    filePath = decodeURIComponent(filePath);
    
    if (filePath === '/') {
      filePath = '/.tests/data-attribute-implementation.html';
    }
    
    // Handle node_modules requests
    if (filePath.startsWith('/node_modules/')) {
      filePath = join(projectRoot, filePath);
    } else {
      filePath = join(projectRoot, filePath);
    }
    
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      // Try to serve index.html from directory
      const indexPath = join(filePath, 'index.html');
      try {
        await stat(indexPath);
        filePath = indexPath;
      } catch {
        res.writeHead(404);
        res.end('Directory listing not available');
        return;
      }
    }
    
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    const content = await readFile(filePath);
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(content);
    
    console.log(`✅ Served: ${req.url} (${contentType})`);
    
  } catch (error) {
    console.log(`❌ Error serving ${req.url}:`, error.message);
    res.writeHead(404);
    res.end('File not found');
  }
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`🚀 SVA Icons Development Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${projectRoot}`);
  console.log(`🧪 Data Attribute Test: http://localhost:${PORT}/.tests/data-attribute-implementation.html`);
  console.log(`🔍 Debug Test: http://localhost:${PORT}/.tests/debug-simple.html`);
  console.log(`📊 Simple Test: http://localhost:${PORT}/.tests/simple-no-modules.html`);
});
