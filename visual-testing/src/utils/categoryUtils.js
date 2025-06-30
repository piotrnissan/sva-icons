/**
 * Category and Tag Utilities
 * 
 * Derives categories and tags from icon names for better organization and filtering
 */

/**
 * Derive category from icon name based on naming patterns
 * @param {string} iconName - The name of the icon
 * @returns {string} - The derived category
 */
export function deriveCategory(iconName) {
  const categoryMap = {
    // Automotive categories
    'abs': 'safety',
    'accelerate': 'performance',
    'accessories': 'accessories',
    'aero': 'performance',
    'after_sales': 'services',
    'airbag': 'safety',
    'alert': 'notifications',
    'alexa': 'technology',
    'ambient': 'comfort',
    'android': 'technology',
    'apple': 'technology',
    'area': 'navigation',
    'arrow': 'navigation',
    'assistance': 'services',
    'assisted': 'safety',
    'automatic': 'performance',
    'autonomous': 'technology',
    'aux': 'media',
    'back': 'media',
    'battery': 'power',
    'bed': 'comfort',
    
    // Common UI categories
    'home': 'navigation',
    'settings': 'controls',
    'menu': 'navigation',
    'search': 'controls',
    'user': 'account',
    'profile': 'account',
    'heart': 'favorites',
    'star': 'ratings',
    'lock': 'security',
    'unlock': 'security',
    'play': 'media',
    'pause': 'media',
    'stop': 'media',
    'volume': 'media',
    'wifi': 'connectivity',
    'bluetooth': 'connectivity',
    'gps': 'navigation',
    'map': 'navigation',
    'calendar': 'time',
    'clock': 'time',
    'weather': 'environment',
    'temperature': 'environment'
  };

  // Check for exact matches first
  for (const [key, category] of Object.entries(categoryMap)) {
    if (iconName.toLowerCase().includes(key)) {
      return category;
    }
  }

  // Default categories based on common patterns
  if (iconName.includes('alert') || iconName.includes('warning') || iconName.includes('error')) {
    return 'notifications';
  }
  
  if (iconName.includes('arrow') || iconName.includes('navigation') || iconName.includes('direction')) {
    return 'navigation';
  }
  
  if (iconName.includes('media') || iconName.includes('play') || iconName.includes('audio')) {
    return 'media';
  }
  
  if (iconName.includes('battery') || iconName.includes('power') || iconName.includes('energy')) {
    return 'power';
  }
  
  if (iconName.includes('safety') || iconName.includes('security') || iconName.includes('protection')) {
    return 'safety';
  }

  // Default category
  return 'general';
}

/**
 * Derive tags from icon name for better searchability
 * @param {string} iconName - The name of the icon
 * @returns {string[]} - Array of tags
 */
export function deriveTags(iconName) {
  const tags = [];
  
  // Add the icon name itself as a tag
  tags.push(iconName);
  
  // Split by common separators and add parts as tags
  const parts = iconName.split(/[-_\s]+/);
  tags.push(...parts.filter(part => part.length > 1));
  
  // Add synonyms and related terms
  const synonymMap = {
    'home': ['house', 'main', 'dashboard'],
    'settings': ['config', 'preferences', 'options', 'gear'],
    'alert': ['warning', 'notification', 'alarm'],
    'arrow': ['direction', 'navigation', 'pointer'],
    'battery': ['power', 'energy', 'charge'],
    'accelerate': ['speed', 'fast', 'boost'],
    'safety': ['protection', 'secure', 'safe'],
    'media': ['audio', 'video', 'entertainment'],
    'navigation': ['gps', 'directions', 'map'],
    'automotive': ['car', 'vehicle', 'auto'],
    'technology': ['tech', 'digital', 'smart'],
    'comfort': ['convenience', 'luxury', 'ease']
  };
  
  // Add synonyms based on icon name content
  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if (iconName.toLowerCase().includes(key)) {
      tags.push(...synonyms);
    }
  }
  
  // Remove duplicates and return
  return [...new Set(tags)];
}

/**
 * Calculate approximate size/complexity of an SVG
 * @param {string} svgContent - The SVG content string
 * @returns {number} - Approximate complexity score
 */
export function calculateSize(svgContent) {
  if (!svgContent || typeof svgContent !== 'string') {
    return 0;
  }
  
  // Simple complexity calculation based on path length and number of elements
  const pathMatches = svgContent.match(/<path[^>]*>/g) || [];
  const elementMatches = svgContent.match(/<[^>]+>/g) || [];
  
  return pathMatches.length * 2 + elementMatches.length;
}

/**
 * Get all unique categories from a list of icons
 * @param {Array} icons - Array of icon objects with category property
 * @returns {string[]} - Array of unique categories
 */
export function getUniqueCategories(icons) {
  const categories = icons.map(icon => icon.category);
  return [...new Set(categories)].sort();
}

/**
 * Filter icons by search term
 * @param {Array} icons - Array of icon objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered array of icons
 */
export function filterIcons(icons, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return icons;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return icons.filter(icon => {
    // Search in name
    if (icon.name.toLowerCase().includes(term)) {
      return true;
    }
    
    // Search in category
    if (icon.category && icon.category.toLowerCase().includes(term)) {
      return true;
    }
    
    // Search in tags
    if (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(term))) {
      return true;
    }
    
    return false;
  });
}
