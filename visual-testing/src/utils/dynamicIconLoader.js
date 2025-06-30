/**
 * Enhanced Icon Data Loader with Dynamic CDN Support
 * Supports both local/built package and dynamic CDN loading
 */

/**
 * Main icon loading function with fallback strategy
 */
export async function loadIconData() {
  console.log('🔄 Starting icon data loading...');
  
  try {
    // Try dynamic loading first (for latest updates)
    if (import.meta.env.VITE_ENABLE_DYNAMIC_LOADING !== 'false') {
      console.log('🌐 Attempting dynamic loading from CDN...');
      const dynamicIcons = await loadFromCDN();
      if (dynamicIcons && dynamicIcons.length > 0) {
        console.log('✅ Using dynamic icons from CDN:', dynamicIcons.length);
        return dynamicIcons;
      }
    }
    
    // Fallback to built package
    console.log('📦 Loading from built package...');
    return await loadFromBuiltPackage();
    
  } catch (error) {
    console.error('❌ All loading methods failed:', error);
    // Final fallback to mock data
    return loadMockFallback();
  }
}

/**
 * Load icons from CDN (unpkg.com)
 */
async function loadFromCDN() {
  try {
    const version = import.meta.env.VITE_SVA_ICONS_VERSION || 'latest';
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://unpkg.com/sva-icons';
    
    console.log(`🌐 Fetching from CDN: ${baseUrl}@${version}`);
    
    // Get package info first
    const packageResponse = await fetch(`${baseUrl}@${version}/package.json`);
    if (!packageResponse.ok) throw new Error('Package info not found');
    
    const packageInfo = await packageResponse.json();
    console.log('📋 Package info:', packageInfo.name, packageInfo.version);
    
    // Get icons.json if available
    let iconsData = [];
    try {
      const iconsResponse = await fetch(`${baseUrl}@${version}/icons.json`);
      if (iconsResponse.ok) {
        iconsData = await iconsResponse.json();
        console.log('📄 Loaded icons.json:', iconsData.length, 'icons');
      }
    } catch (e) {
      console.log('⚠️ icons.json not found, will build from dist folder');
    }
    
    // If no icons.json, try to build from the icons-browser.js
    if (iconsData.length === 0) {
      try {
        const iconsBrowserResponse = await fetch(`${baseUrl}@${version}/src/icons-browser.js`);
        if (iconsBrowserResponse.ok) {
          const iconsBrowserText = await iconsBrowserResponse.text();
          iconsData = parseIconsBrowserJS(iconsBrowserText);
          console.log('🔧 Built from icons-browser.js:', iconsData.length, 'icons');
        }
      } catch (e) {
        console.log('⚠️ Could not load icons-browser.js');
      }
    }
    
    // Enhance icon data with metadata
    return iconsData.map(icon => ({
      ...icon,
      source: 'cdn-dynamic',
      version: packageInfo.version,
      loadedAt: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('❌ CDN loading failed:', error);
    throw error;
  }
}

/**
 * Load from built package (local development or static build)
 */
async function loadFromBuiltPackage() {
  try {
    // Try loading the real automated icons-browser.js
    console.log('🔍 Loading from automated icons-browser.js...');
    const iconsBrowserModule = await import('../../../src/icons-browser.js');
    
    if (iconsBrowserModule.iconRegistry) {
      const iconRegistry = iconsBrowserModule.iconRegistry;
      const iconNames = Object.keys(iconRegistry);
      
      console.log(`✅ Loaded ${iconNames.length} icons from built package`);
      
      const iconArray = iconNames.map(iconName => {
        const svgContent = iconRegistry[iconName]();
        return {
          name: iconName,
          svg: svgContent,
          category: deriveCategory(iconName),
          tags: deriveTags(iconName),
          size: calculateSVGSize(svgContent),
          source: 'built-package',
          loadedAt: new Date().toISOString()
        };
      });
      
      return iconArray;
    }
  } catch (error) {
    console.error('❌ Built package loading failed:', error);
    
    // Try alternative: load from icons.json if exists
    try {
      const iconsJsonResponse = await fetch('/icons.json');
      if (iconsJsonResponse.ok) {
        const iconsData = await iconsJsonResponse.json();
        console.log('📄 Loaded from icons.json:', iconsData.length);
        return iconsData.map(icon => ({
          ...icon,
          source: 'built-package-json',
          loadedAt: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.log('⚠️ icons.json not found in public folder');
    }
    
    throw error;
  }
}

/**
 * Parse icons-browser.js text to extract icon data
 */
function parseIconsBrowserJS(jsText) {
  try {
    // This is a simplified parser - in reality you might want to use a proper JS parser
    const iconRegistry = {};
    
    // Look for icon function definitions
    const iconMatches = jsText.matchAll(/(\w+):\s*\(\)\s*=>\s*`([^`]+)`/g);
    
    for (const match of iconMatches) {
      const [, iconName, svgContent] = match;
      iconRegistry[iconName] = svgContent;
    }
    
    return Object.keys(iconRegistry).map(iconName => ({
      name: iconName,
      svg: iconRegistry[iconName],
      category: deriveCategory(iconName),
      tags: deriveTags(iconName),
      size: calculateSVGSize(iconRegistry[iconName]),
      source: 'parsed-js',
      loadedAt: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('❌ Failed to parse icons-browser.js:', error);
    return [];
  }
}

/**
 * Mock fallback data
 */
function loadMockFallback() {
  console.log('⚠️ Using mock fallback data');
  
  const mockIcons = [
    'car', 'alert', 'battery', 'charging', 'home', 'settings',
    'plus', 'minus', 'search', 'menu', 'close', 'arrow-right'
  ];
  
  return mockIcons.map(name => ({
    name,
    svg: `<svg viewBox="0 0 24 24"><text x="12" y="12" text-anchor="middle">${name}</text></svg>`,
    category: 'mock',
    tags: [name, 'fallback'],
    size: { width: 24, height: 24 },
    source: 'mock-fallback',
    loadedAt: new Date().toISOString()
  }));
}

/**
 * Derive category from icon name
 */
function deriveCategory(iconName) {
  const carRelated = ['car', 'battery', 'charging', 'brake', 'fuel', 'engine'];
  const uiRelated = ['plus', 'minus', 'close', 'menu', 'search', 'settings'];
  const navigation = ['arrow', 'back', 'forward', 'up', 'down', 'left', 'right'];
  
  if (carRelated.some(keyword => iconName.includes(keyword))) return 'automotive';
  if (uiRelated.some(keyword => iconName.includes(keyword))) return 'ui';
  if (navigation.some(keyword => iconName.includes(keyword))) return 'navigation';
  
  return 'general';
}

/**
 * Derive tags from icon name
 */
function deriveTags(iconName) {
  const words = iconName.split('-');
  return [...words, deriveCategory(iconName)];
}

/**
 * Calculate SVG size from SVG content
 */
function calculateSVGSize(svgContent) {
  try {
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    if (viewBoxMatch) {
      const [, x, y, width, height] = viewBoxMatch[1].split(' ').map(Number);
      return { width, height };
    }
    
    const widthMatch = svgContent.match(/width="([^"]+)"/);
    const heightMatch = svgContent.match(/height="([^"]+)"/);
    
    if (widthMatch && heightMatch) {
      return { 
        width: parseFloat(widthMatch[1]), 
        height: parseFloat(heightMatch[1]) 
      };
    }
  } catch (error) {
    console.warn('Could not parse SVG size:', error);
  }
  
  return { width: 24, height: 24 }; // Default size
}

/**
 * Watch for icon updates (for development)
 */
export function watchForNewIcons(callback) {
  if (import.meta.env.DEV) {
    // In development, check for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const newIcons = await loadIconData();
        callback(newIcons);
      } catch (error) {
        console.warn('Icon watcher error:', error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }
  
  // In production, no watching needed (updates come via rebuild)
  return () => {};
}

// Keep the original function for backward compatibility
export { loadIconData as loadIconDataDynamic };

// Re-export the original function
export { loadIconData as default };
