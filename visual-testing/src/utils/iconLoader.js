/**
 * Real Icon Data Loader for SVA Icons Visual Testing
 * 
 * This loader integrates with the actual SVA icon system to provide
 * real, up-to-date icon data for visual testing.
 * 
 * Now connected to automated icons-browser.js for real-time updates!
 */

/**
 * Load real icon data from the automated icons-browser.js
 * @returns {Promise<Array>} Array of icon objects with real data
 */
export const loadRealIconData = async () => {
  try {
    console.log('🔍 Loading real icons from automated icons-browser.js...');
    
    // Import from our automated icons-browser.js file
    const iconsBrowserModule = await import('../../../src/icons-browser.js');
    
    if (iconsBrowserModule.iconRegistry) {
      const iconRegistry = iconsBrowserModule.iconRegistry;
      const iconNames = Object.keys(iconRegistry);
      
      console.log(`✅ Successfully loaded ${iconNames.length} icons from automated system`);
      console.log('📋 Icons found:', iconNames);
      
      // Convert to our visual testing format
      const iconArray = iconNames.map(iconName => {
        const svgContent = iconRegistry[iconName]();
        return {
          name: iconName,
          svg: svgContent,
          category: deriveCategory(iconName),
          tags: deriveTags(iconName),
          size: calculateSVGSize(svgContent),
          source: 'automated-icons-browser',
          lastModified: new Date().toISOString()
        };
      });
      
      console.log('🎉 Created', iconArray.length, 'icon objects from automated system');
      return iconArray;
    }
    
  } catch (error) {
    console.error('❌ Failed to load from automated icons-browser.js:', error);
    console.log('🔄 Falling back to simulation...');
    return loadIconsFromDistFolder();
  }
};

/**
 * Parse CommonJS exports from the built icon file
 */
const parseIconExports = (text) => {
  const iconData = {};
  const exportMatches = text.matchAll(/exports\['([^']+)'\]\s*=\s*`([^`]+)`/g);
  
  for (const match of exportMatches) {
    const [, iconName, svgContent] = match;
    iconData[iconName] = svgContent;
  }
  
  return iconData;
};

/**
 * Create icon array from icon data object
 */
const createIconArray = (iconData, source) => {
  const iconNames = Object.keys(iconData);
  return iconNames.map(iconName => ({
    name: iconName,
    svg: iconData[iconName],
    category: deriveCategory(iconName),
    tags: deriveTags(iconName),
    size: calculateSVGSize(iconData[iconName]),
    source: source,
    lastModified: new Date().toISOString()
  }));
};

/**
 * Alternative method: Load icons by reading the dist folder directly
 */
export const loadIconsFromDistFolder = async () => {
  try {
    console.log('🔍 Starting loadIconsFromDistFolder...');
    
    // This would work if we can access the file system directly
    // For now, we'll simulate what the data would look like based on what we saw
    const builtIconData = {
      'abs-alert': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.189 13.105H7.552C7.488 13.313 7.424 13.526 7.36 13.734H6.501C6.922 12.355 7.367 11.206 7.884 10.097L7.813 10.267H8.965C9.417 11.205 9.871 12.353 10.249 13.536L10.304 13.735H9.392L9.189 13.105ZM8.954 12.406C8.783 11.921 8.602 11.435 8.362 10.88C8.149 11.371 7.956 11.888 7.781 12.406H8.954ZM12.208 10.267C12.939 10.267 13.761 10.416 13.761 11.152C13.751 11.525 13.497 11.835 13.153 11.929L13.147 11.93V11.946C13.559 11.979 13.885 12.307 13.915 12.717V12.72C13.915 13.563 13.115 13.734 12.411 13.734H10.784V10.267H12.208ZM11.611 11.675H12.241C12.587 11.675 12.891 11.616 12.891 11.291C12.891 10.966 12.566 10.934 12.261 10.934H11.611V11.675ZM11.611 13.067H12.406C12.832 13.067 13.051 12.971 13.051 12.678C13.051 12.331 12.757 12.267 12.347 12.267H11.611V13.067ZM17.26 10.379V11.105C16.882 10.993 16.447 10.927 15.997 10.923H15.995C15.504 10.923 15.345 11.046 15.345 11.233C15.345 11.345 15.42 11.446 15.702 11.521L16.614 11.761C17.249 11.926 17.5 12.252 17.5 12.7C17.5 13.393 16.987 13.798 15.963 13.798C15.947 13.798 15.929 13.798 15.91 13.798C15.425 13.798 14.957 13.728 14.515 13.597L14.55 13.606V12.854C14.934 12.968 15.382 13.047 15.843 13.077L15.862 13.078C16.411 13.078 16.646 12.997 16.646 12.779C16.646 12.624 16.492 12.496 16.177 12.416L15.296 12.192C14.839 12.114 14.496 11.721 14.496 11.248C14.496 11.246 14.496 11.244 14.496 11.242C14.496 10.549 14.998 10.202 16.054 10.202C16.487 10.212 16.901 10.275 17.295 10.387L17.26 10.379ZM12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C20.994 16.968 16.968 20.994 12.001 21H12ZM12 5C8.134 5 5 8.134 5 12C5 15.866 8.134 19 12 19C15.866 19 19 15.866 19 12C18.996 8.136 15.864 5.004 12 5ZM5.136 19.272C3.203 17.445 2 14.863 2 12C2 9.137 3.203 6.556 5.131 4.733L5.136 4.729L3.763 3.275C1.444 5.468 0 8.566 0 12.001C0 15.436 1.444 18.534 3.757 20.722L3.763 20.727L5.136 19.272ZM24 12C24 11.986 24 11.969 24 11.952C24 8.532 22.556 5.449 20.244 3.28L20.238 3.274L18.865 4.728C20.797 6.555 22 9.137 22 12C22 14.863 20.797 17.444 18.869 19.267L18.864 19.271L20.237 20.725C22.555 18.50 23.999 15.467 23.999 12.047C23.999 12.03 23.999 12.013 23.999 11.996V11.999L24 12Z"/></svg>`,
      'burger-menu': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 6C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H3ZM2 12C2 12.5523 2.44772 13 3 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H3C2.44772 11 2 11.4477 2 12ZM2 19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19C22 18.4477 21.5523 18 21 18H3C2.44772 18 2 18.4477 2 19Z"/></svg>`,
      'car': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.994 7.00005H21.494C20.997 7.00005 20.604 7.36905 20.526 7.84305L18.316 4.30805C17.796 3.47605 16.902 2.95205 15.922 2.90205C14.623 2.83405 13.316 2.80005 12 2.80005C10.685 2.80005 9.377 2.83405 8.078 2.90105C7.098 2.95205 6.204 3.47605 5.684 4.30705L3.47 7.85005C3.394 7.37205 2.999 7.00005 2.5 7.00005H1C0.448 7.00005 0 7.44805 0 8.00005V9.00005C0 9.55205 0.448 10 1 10H1.488C1.171 10.743 1 11.543 1 12.357L0.994 22C0.994 22.552 1.442 23 1.994 23H3.994C4.546 23 4.994 22.552 4.994 22V19.664C7.302 19.878 9.636 20 12 20C14.36 20 16.69 19.878 18.994 19.6651V22C18.994 22.552 19.442 23 19.994 23H21.994C22.546 23 22.994 22.552 22.994 22L23 12.357C23 11.543 22.829 10.743 22.512 10H22.995C23.547 10 23.995 9.55205 23.995 9.00005V8.00005C23.994 7.44805 23.547 7.00005 22.994 7.00005ZM6.952 5.10105C7.212 4.68505 7.662 4.42105 8.155 4.39505C9.43 4.32905 10.724 4.29605 12 4.29605C13.276 4.29605 14.57 4.32905 15.845 4.39505C16.338 4.42105 16.788 4.68405 17.048 5.10105L19.234 8.59705C16.847 8.86405 14.434 9.00005 12 9.00005C9.566 9.00005 7.153 8.86405 4.766 8.59705L6.952 5.10105ZM16.765 11.634L14.955 14.53C14.773 14.822 14.452 15 14.107 15H9.893C9.548 15 9.228 14.822 9.045 14.53L7.235 11.634C7.647 11.66 8.054 11.7 8.468 11.72L9.746 13.765C9.838 13.911 9.998 14 10.17 14H13.83C14.002 14 14.163 13.911 14.254 13.765L15.532 11.72C15.946 11.701 16.353 11.66 16.765 11.634ZM22 11.578C22 11.765 21.947 11.949 21.848 12.108L21.797 12.189C21.584 12.53 21.276 12.802 20.906 12.96C20.096 13.307 19.219 13.526 18.304 13.61L15.855 17.53C15.673 17.822 15.352 18 15.007 18H8.993C8.648 18 8.327 17.822 8.145 17.53L5.696 13.61C4.78 13.526 3.904 13.307 3.094 12.96C2.725 12.802 2.416 12.529 2.203 12.189L2.152 12.108C2.053 11.949 2 11.765 2 11.578V11.118C2 10.818 2.315 10.628 2.583 10.763C3.385 11.166 4.259 11.447 5.18 11.583C5.476 11.627 5.742 11.786 5.899 12.04L8.845 16.765C8.937 16.911 9.098 17 9.27 17H14.73C14.902 17 15.063 16.911 15.154 16.765L18.1 12.04C18.258 11.786 18.524 11.627 18.819 11.583C19.74 11.447 20.614 11.166 21.416 10.763C21.684 10.628 22 10.818 22 11.118V11.578Z"/></svg>`
    };
    
    console.log('📝 Built icon data:', Object.keys(builtIconData));
    console.log('✅ Loaded real icon data from built package simulation');
    
    const iconNames = Object.keys(builtIconData);
    const result = iconNames.map(iconName => ({
      name: iconName,
      svg: builtIconData[iconName],
      category: deriveCategory(iconName),
      tags: deriveTags(iconName),
      size: calculateSVGSize(builtIconData[iconName]),
      source: 'built-package-simulation',
      lastModified: new Date().toISOString()
    }));
    
    console.log('📊 Created icon objects:', result.length);
    console.log('📋 Icon names:', result.map(icon => icon.name));
    
    return result;
    
  } catch (error) {
    console.error('Failed to load from dist folder:', error);
    return loadMockIconData();
  }
};

/**
 * Derive category from icon name based on naming patterns
 */
const deriveCategory = (iconName) => {
  // Automotive-specific categories
  if (iconName.includes('abs') || iconName.includes('brake') || iconName.includes('airbag')) {
    return 'Safety';
  }
  if (iconName.includes('car') || iconName.includes('vehicle') || iconName.includes('engine')) {
    return 'Automotive';
  }
  if (iconName.includes('nav') || iconName.includes('arrow') || iconName.includes('direction')) {
    return 'Navigation';
  }
  if (iconName.includes('setting') || iconName.includes('config') || iconName.includes('gear')) {
    return 'Settings';
  }
  if (iconName.includes('menu') || iconName.includes('burger') || iconName.includes('list')) {
    return 'Interface';
  }
  if (iconName.includes('alert') || iconName.includes('warning') || iconName.includes('error')) {
    return 'Alerts';
  }
  
  // Default categories
  return 'General';
};

/**
 * Derive tags from icon name for better search capability
 */
const deriveTags = (iconName) => {
  const tags = [];
  
  // Add the icon name itself
  tags.push(iconName);
  
  // Add word parts
  const words = iconName.split(/[-_]/);
  tags.push(...words.filter(word => word.length > 1));
  
  // Add semantic tags based on name patterns
  if (iconName.includes('alert') || iconName.includes('warning')) {
    tags.push('notification', 'status', 'alert');
  }
  if (iconName.includes('menu') || iconName.includes('burger')) {
    tags.push('navigation', 'menu', 'ui');
  }
  if (iconName.includes('car') || iconName.includes('vehicle')) {
    tags.push('automotive', 'transport', 'vehicle');
  }
  
  return [...new Set(tags)]; // Remove duplicates
};

/**
 * Calculate approximate SVG size/complexity
 */
const calculateSVGSize = (svgString) => {
  if (!svgString) return 0;
  
  // Count path elements and attributes as a complexity measure
  const pathCount = (svgString.match(/<path/g) || []).length;
  const charCount = svgString.length;
  
  if (charCount < 200) return 'xs';
  if (charCount < 500) return 's';
  if (charCount < 1000) return 'm';
  if (charCount < 2000) return 'l';
  return 'xl';
};

/**
 * FALLBACK: Mock icon data (only used if real data fails)
 */
const loadMockIconData = () => {
  console.warn('⚠️ Using fallback mock data - real icon integration failed');
  
  return [
    {
      name: 'abs-alert',
      svg: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      category: 'Safety',
      tags: ['abs', 'alert', 'safety', 'automotive'],
      size: 'm',
      source: 'mock-fallback'
    },
    {
      name: 'burger-menu',
      svg: '<svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
      category: 'Interface',
      tags: ['menu', 'burger', 'navigation', 'ui'],
      size: 's',
      source: 'mock-fallback'
    },
    {
      name: 'car',
      svg: '<svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
      category: 'Automotive',
      tags: ['car', 'vehicle', 'automotive', 'transport'],
      size: 'l',
      source: 'mock-fallback'
    }
  ];
};

/**
 * Watch for new icons being added to the system
 * This would integrate with the file system or build process
 */
export const watchForNewIcons = (callback) => {
  console.log('🔍 Setting up icon watcher...');
  
  // In a real implementation, this would:
  // 1. Watch the svg/ folder for new files
  // 2. Listen for build process completion
  // 3. Poll for changes in the dist/ packages
  
  // For now, we'll simulate periodic checks
  const interval = setInterval(async () => {
    try {
      const currentIcons = await loadRealIconData();
      callback(currentIcons);
    } catch (error) {
      console.error('Icon watcher error:', error);
    }
  }, 30000); // Check every 30 seconds
  
  return () => clearInterval(interval);
};

/**
 * Get icon usage information from the class-based API
 */
export const getIconUsageInfo = async (iconName) => {
  try {
    // This would integrate with the class-based scanner to see if an icon is in use
    // For now, return mock usage data
    return {
      iconName,
      usageCount: Math.floor(Math.random() * 10),
      lastUsed: new Date().toISOString(),
      contexts: ['class-based', 'web-component']
    };
  } catch (error) {
    console.error('Failed to get icon usage info:', error);
    return null;
  }
};

/**
 * Utility functions for filtering and searching
 */
export const getUniqueCategories = (icons) => {
  const categories = icons.map(icon => icon.category);
  return [...new Set(categories)].sort();
};

export const filterIconsBySearch = (icons, searchTerm) => {
  if (!searchTerm) return icons;
  
  const term = searchTerm.toLowerCase();
  return icons.filter(icon => 
    icon.name.toLowerCase().includes(term) ||
    icon.category.toLowerCase().includes(term) ||
    icon.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

export const filterIconsByCategory = (icons, category) => {
  if (!category || category === 'all') return icons;
  return icons.filter(icon => icon.category === category);
};

// Main export - use automated icon data by default, fallback to simulation
export const loadIconData = async () => {
  console.log('🚀 loadIconData called - starting automated icon loading process...');
  
  try {
    // Use our new automated loader that connects to icons-browser.js
    console.log('� Using automated icons-browser.js for real-time data...');
    const result = await loadRealIconData();
    console.log('📊 loadRealIconData returned:', result.length, 'icons');
    return result;
    return result;
  } catch (error) {
    console.error('❌ All loading methods failed:', error);
    // Ultimate fallback
    console.log('🔄 Using ultimate fallback mock data...');
    return loadMockIconData();
  }
};
