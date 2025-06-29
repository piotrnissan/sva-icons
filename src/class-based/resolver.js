/**
 * SVA Icons Class-Based API - Name Resolution System
 * 
 * This module handles the mapping between CSS class names and icon functions.
 * It converts kebab-case class names to PascalCase function names and manages
 * the icon registry lookup system.
 * 
 * Features:
 * - kebab-case to PascalCase conversion
 * - Icon registry lookup and validation
 * - Fallback handling for missing icons
 * - Performance optimized for < 0.1ms per resolution
 * 
 * @module resolver
 * @version 2.2.0
 * @author SVA Icons Team
 */

/**
 * @typedef {Object} IconRegistry
 * @property {Function} iconFunction - The icon rendering function
 * @property {Object} metadata - Icon metadata (categories, tags, etc.)
 * @property {string} name - Original icon name
 */

/**
 * @typedef {Object} ResolverConfig
 * @property {string} prefix - Class prefix (default: 'sva-icon-')
 * @property {string} fallbackIcon - Icon to use when target not found
 * @property {boolean} strictMode - Throw errors for missing icons (default: false)
 * @property {boolean} cacheResults - Cache resolved icons for performance (default: true)
 */

/**
 * @typedef {Object} ResolutionResult
 * @property {Function|null} iconFunction - The resolved icon function
 * @property {string} iconName - The resolved icon name
 * @property {string} originalClass - The original class name
 * @property {boolean} fromFallback - Whether fallback icon was used
 * @property {string|null} error - Error message if resolution failed
 * @property {number} resolutionTime - Time taken to resolve in milliseconds
 */

/**
 * Default resolver configuration
 */
const DEFAULT_CONFIG = {
    prefix: 'sva-icon-',
    fallbackIcon: null,
    strictMode: false,
    cacheResults: true
};

/**
 * Cache for resolved icon names to improve performance
 * @type {Map<string, Function>}
 */
const resolutionCache = new Map();

/**
 * Registry to store available icon functions
 * Key: PascalCase icon name (e.g., 'Plus', 'ArrowRight')
 * Value: Icon function
 * @type {Map<string, IconRegistry>}
 */
const iconRegistry = new Map();

/**
 * Convert kebab-case string to PascalCase
 * @param {string} kebabStr - String in kebab-case format
 * @returns {string} String in PascalCase format
 * 
 * @example
 * kebabToPascal('arrow-right') // returns 'ArrowRight'
 * kebabToPascal('plus') // returns 'Plus'
 * kebabToPascal('user-profile-settings') // returns 'UserProfileSettings'
 */
export function kebabToPascal(kebabStr) {
    if (typeof kebabStr !== 'string' || kebabStr.length === 0) {
        return '';
    }
    
    return kebabStr
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

/**
 * Convert PascalCase string to kebab-case
 * @param {string} pascalStr - String in PascalCase format
 * @returns {string} String in kebab-case format
 * 
 * @example
 * pascalToKebab('ArrowRight') // returns 'arrow-right'
 * pascalToKebab('Plus') // returns 'plus'
 */
export function pascalToKebab(pascalStr) {
    if (typeof pascalStr !== 'string' || pascalStr.length === 0) {
        return '';
    }
    
    return pascalStr
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
}

/**
 * Extract icon name from CSS class
 * @param {string} className - The CSS class name
 * @param {string} prefix - The class prefix to remove
 * @returns {string|null} The extracted icon name or null if invalid
 * 
 * @example
 * extractIconName('sva-icon-plus', 'sva-icon-') // returns 'plus'
 * extractIconName('sva-icon-arrow-right', 'sva-icon-') // returns 'arrow-right'
 */
export function extractIconName(className, prefix = 'sva-icon-') {
    if (typeof className !== 'string' || !className.startsWith(prefix)) {
        return null;
    }
    
    const iconName = className.substring(prefix.length);
    
    // Validate icon name format (only letters, numbers, and hyphens)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(iconName)) {
        return null;
    }
    
    return iconName;
}

/**
 * Register an icon function in the resolver
 * @param {string} iconName - Name of the icon (PascalCase)
 * @param {Function} iconFunction - The icon rendering function
 * @param {Object} metadata - Optional metadata about the icon
 * @returns {boolean} True if registration succeeded
 * 
 * @example
 * registerIcon('Plus', PlusIconFunction, { category: 'ui', tags: ['add', 'create'] })
 */
export function registerIcon(iconName, iconFunction, metadata = {}) {
    if (typeof iconName !== 'string' || typeof iconFunction !== 'function') {
        console.warn('Invalid parameters for registerIcon:', { iconName, iconFunction });
        return false;
    }
    
    iconRegistry.set(iconName, {
        iconFunction,
        metadata,
        name: iconName
    });
    
    // Clear cache for this icon if it exists
    const kebabName = pascalToKebab(iconName);
    resolutionCache.delete(kebabName);
    
    return true;
}

/**
 * Register multiple icons at once
 * @param {Object} icons - Object with icon names as keys and functions as values
 * @returns {number} Number of successfully registered icons
 * 
 * @example
 * registerIcons({
 *   Plus: PlusFunction,
 *   ArrowRight: ArrowRightFunction,
 *   Settings: SettingsFunction
 * })
 */
export function registerIcons(icons) {
    if (typeof icons !== 'object' || icons === null) {
        console.warn('registerIcons expects an object');
        return 0;
    }
    
    let registered = 0;
    
    for (const [iconName, iconFunction] of Object.entries(icons)) {
        if (registerIcon(iconName, iconFunction)) {
            registered++;
        }
    }
    
    return registered;
}

/**
 * Check if an icon is registered
 * @param {string} iconName - Icon name to check (PascalCase or kebab-case)
 * @returns {boolean} True if icon is registered
 */
export function hasIcon(iconName) {
    if (typeof iconName !== 'string') {
        return false;
    }
    
    // Try both PascalCase and converted version
    if (iconRegistry.has(iconName)) {
        return true;
    }
    
    const pascalName = kebabToPascal(iconName);
    return iconRegistry.has(pascalName);
}

/**
 * Get icon function by name
 * @param {string} iconName - Icon name (PascalCase or kebab-case)
 * @returns {Function|null} Icon function or null if not found
 */
export function getIcon(iconName) {
    if (typeof iconName !== 'string') {
        return null;
    }
    
    // Try direct lookup first (PascalCase)
    let iconEntry = iconRegistry.get(iconName);
    
    if (!iconEntry) {
        // Try converting kebab-case to PascalCase
        const pascalName = kebabToPascal(iconName);
        iconEntry = iconRegistry.get(pascalName);
    }
    
    return iconEntry ? iconEntry.iconFunction : null;
}

/**
 * Resolve a CSS class name to an icon function
 * @param {string} className - The CSS class name
 * @param {ResolverConfig} config - Resolver configuration
 * @returns {ResolutionResult} Resolution result
 */
export function resolveIcon(className, config = {}) {
    const startTime = performance.now();
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    const result = {
        iconFunction: null,
        iconName: '',
        originalClass: className,
        fromFallback: false,
        error: null,
        resolutionTime: 0
    };
    
    try {
        // Extract icon name from class
        const iconName = extractIconName(className, finalConfig.prefix);
        
        if (!iconName) {
            result.error = `Invalid class name format: ${className}`;
            result.resolutionTime = performance.now() - startTime;
            return result;
        }
        
        result.iconName = iconName;
        
        // Check cache first if caching is enabled
        if (finalConfig.cacheResults && resolutionCache.has(iconName)) {
            result.iconFunction = resolutionCache.get(iconName);
            result.resolutionTime = performance.now() - startTime;
            return result;
        }
        
        // Try to resolve the icon
        let iconFunction = getIcon(iconName);
        
        if (!iconFunction && finalConfig.fallbackIcon) {
            // Try fallback icon
            iconFunction = getIcon(finalConfig.fallbackIcon);
            result.fromFallback = true;
        }
        
        if (!iconFunction) {
            const error = `Icon not found: ${iconName}`;
            
            if (finalConfig.strictMode) {
                throw new Error(error);
            }
            
            result.error = error;
            result.resolutionTime = performance.now() - startTime;
            return result;
        }
        
        result.iconFunction = iconFunction;
        
        // Cache the result if caching is enabled
        if (finalConfig.cacheResults) {
            resolutionCache.set(iconName, iconFunction);
        }
        
    } catch (error) {
        result.error = error.message;
    }
    
    result.resolutionTime = performance.now() - startTime;
    return result;
}

/**
 * Resolve multiple class names at once
 * @param {string[]} classNames - Array of class names to resolve
 * @param {ResolverConfig} config - Resolver configuration
 * @returns {ResolutionResult[]} Array of resolution results
 */
export function resolveIcons(classNames, config = {}) {
    if (!Array.isArray(classNames)) {
        return [];
    }
    
    return classNames.map(className => resolveIcon(className, config));
}

/**
 * Get all registered icon names
 * @returns {string[]} Array of registered icon names (PascalCase)
 */
export function getRegisteredIcons() {
    return Array.from(iconRegistry.keys());
}

/**
 * Get icon metadata
 * @param {string} iconName - Icon name (PascalCase or kebab-case)
 * @returns {Object|null} Icon metadata or null if not found
 */
export function getIconMetadata(iconName) {
    if (typeof iconName !== 'string') {
        return null;
    }
    
    let iconEntry = iconRegistry.get(iconName);
    
    if (!iconEntry) {
        const pascalName = kebabToPascal(iconName);
        iconEntry = iconRegistry.get(pascalName);
    }
    
    return iconEntry ? iconEntry.metadata : null;
}

/**
 * Clear the resolution cache
 * @returns {number} Number of cached entries cleared
 */
export function clearCache() {
    const size = resolutionCache.size;
    resolutionCache.clear();
    return size;
}

/**
 * Clear all registered icons
 * @returns {number} Number of icons cleared
 */
export function clearRegistry() {
    const size = iconRegistry.size;
    iconRegistry.clear();
    resolutionCache.clear();
    return size;
}

/**
 * Performance test for name resolution
 * @param {number} iterations - Number of iterations to test
 * @returns {Object} Performance test results
 */
export function performanceTest(iterations = 1000) {
    // Register test icons
    const testIcons = {};
    for (let i = 0; i < 100; i++) {
        testIcons[`TestIcon${i}`] = () => `<svg>test${i}</svg>`;
    }
    registerIcons(testIcons);
    
    const startTime = performance.now();
    
    // Test resolution performance
    for (let i = 0; i < iterations; i++) {
        const iconName = `test-icon-${i % 100}`;
        const className = `sva-icon-${iconName}`;
        resolveIcon(className);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / iterations;
    
    return {
        iterations,
        totalTime,
        averageTime,
        passed: averageTime < 0.1, // Must be under 0.1ms per resolution
        cacheSize: resolutionCache.size
    };
}

/**
 * Create a resolver instance with specific configuration
 * @param {ResolverConfig} config - Resolver configuration
 * @returns {Object} Resolver instance with bound methods
 */
export function createResolver(config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    return {
        resolve: (className) => resolveIcon(className, finalConfig),
        resolveMultiple: (classNames) => resolveIcons(classNames, finalConfig),
        hasIcon,
        getIcon,
        registerIcon,
        registerIcons,
        getRegisteredIcons,
        clearCache,
        config: finalConfig
    };
}

/**
 * Default export with main resolver functionality
 */
export default {
    resolveIcon,
    resolveIcons,
    registerIcon,
    registerIcons,
    hasIcon,
    getIcon,
    getRegisteredIcons,
    getIconMetadata,
    clearCache,
    clearRegistry,
    createResolver,
    kebabToPascal,
    pascalToKebab,
    extractIconName,
    performanceTest
};
