/**
 * SVA Icons Class-Based API - Main Initialization Module
 * 
 * This is the main entry point for the class-based icon system.
 * It orchestrates the scanner, resolver, and injector to provide
 * a complete class-based icon solution.
 * 
 * Features:
 * - Auto-initialization on DOM ready
 * - Manual initialization support
 * - Configuration management
 * - Error handling and logging
 * - Performance monitoring
 * - Mutation observer for dynamic content
 * 
 * @module index
 * @version 2.2.0
 * @author SVA Icons Team
 */

import { IconScanner, scanForIcons } from './scanner.js';
import { SVGInjector } from './injector.js';
import { resolveIcon, registerIcon, registerIcons, createResolver } from './resolver.js';
import { IconMutationObserver, initializeObserver, stopObserver, getObserver } from './observer.js';

/**
 * @typedef {Object} ClassBasedConfig
 * @property {string} prefix - Class prefix to scan for (default: 'sva-icon-')
 * @property {boolean} autoInit - Auto-initialize on DOMContentLoaded (default: true)
 * @property {boolean} mutationObserver - Watch for dynamic content (default: true)
 * @property {number} debounceDelay - Mutation observer debounce delay in ms (default: 50)
 * @property {number} batchSize - Process icons in batches (default: 100)
 * @property {boolean} themeIntegration - Enable CSS variable support (default: true)
 * @property {boolean} preserveClasses - Keep original classes on SVG (default: true)
 * @property {string} fallbackIcon - Icon to use when target not found
 * @property {Object} sizes - Size configuration using CSS variables
 * @property {Object} colors - Color configuration using CSS variables
 * @property {Array<string>} includeIcons - Limit to specific bundles
 * @property {Array<string>} excludeIcons - Exclude specific patterns
 * @property {Function} onIconInjected - Callback when icon is injected
 * @property {Function} onError - Callback when error occurs
 * @property {boolean} enableLogging - Enable console logging (default: false)
 * @property {Element} scope - Root element to scan (default: document)
 */

/**
 * @typedef {Object} InitializationResult
 * @property {boolean} success - Whether initialization succeeded
 * @property {number} iconsFound - Number of icon elements found
 * @property {number} iconsInjected - Number of icons successfully injected
 * @property {number} initTime - Time taken to initialize in milliseconds
 * @property {string[]} errors - Array of error messages
 * @property {Object} config - Final configuration used
 */

/**
 * Default configuration for the class-based icon system
 */
const DEFAULT_CONFIG = {
    prefix: 'sva-icon-',
    autoInit: true,
    mutationObserver: true,
    debounceDelay: 50,
    batchSize: 100,
    themeIntegration: true,
    preserveClasses: true,
    fallbackIcon: null,
    sizes: {
        xs: 'var(--sva-icon-size-xs, 12px)',
        s: 'var(--sva-icon-size-s, 16px)',
        m: 'var(--sva-icon-size-m, 24px)',
        l: 'var(--sva-icon-size-l, 32px)',
        xl: 'var(--sva-icon-size-xl, 48px)'
    },
    colors: {
        primary: 'var(--sva-icon-color-primary, var(--color-primary))',
        secondary: 'var(--sva-icon-color-secondary, var(--color-secondary))',
        success: 'var(--sva-icon-color-success, var(--color-success))',
        warning: 'var(--sva-icon-color-warning, var(--color-warning))',
        error: 'var(--sva-icon-color-error, var(--color-error))',
        inverse: 'var(--sva-icon-color-inverse, var(--color-inverse))'
    },
    includeIcons: [],
    excludeIcons: [],
    onIconInjected: null,
    onError: null,
    enableLogging: false,
    scope: typeof document !== 'undefined' ? document : null
};

/**
 * Global state for the class-based icon system
 */
let isInitialized = false;
let currentConfig = null;
let scanner = null;
let injector = null;
let resolver = null;
let mutationObserver = null;
let statistics = {
    totalScans: 0,
    totalInjections: 0,
    totalErrors: 0,
    averageScanTime: 0,
    averageInjectionTime: 0
};

/**
 * Debounce function for mutation observer
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Log message if logging is enabled
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
function log(level, message, data = null) {
    if (!currentConfig?.enableLogging) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[SVA Icons ${timestamp}]`;
    
    if (data) {
        console[level](`${prefix} ${message}`, data);
    } else {
        console[level](`${prefix} ${message}`);
    }
}

/**
 * Handle errors with optional callback
 * @param {string} message - Error message
 * @param {Error|any} error - Error object or data
 * @param {Element} element - Related element if any
 */
function handleError(message, error = null, element = null) {
    statistics.totalErrors++;
    
    const errorData = {
        message,
        error: error?.message || error,
        element: element?.tagName || null,
        timestamp: Date.now()
    };
    
    log('error', message, errorData);
    
    if (currentConfig?.onError && typeof currentConfig.onError === 'function') {
        try {
            currentConfig.onError(errorData);
        } catch (callbackError) {
            console.error('Error in onError callback:', callbackError);
        }
    }
}

/**
 * Process and inject icons for found elements
 * @param {Array} iconElements - Array of icon elements from scanner
 * @returns {number} Number of successfully injected icons
 */
async function processIcons(iconElements) {
    if (!iconElements || iconElements.length === 0) {
        return 0;
    }
    
    const startTime = performance.now();
    let injected = 0;
    
    try {
        // Process icons in batches for better performance
        const batchSize = currentConfig.batchSize || 100;
        
        for (let i = 0; i < iconElements.length; i += batchSize) {
            const batch = iconElements.slice(i, i + batchSize);
            
            for (const iconElement of batch) {
                try {
                    // Resolve icon function
                    const resolution = resolver.resolve(`${currentConfig.prefix}${iconElement.iconName}`);
                    
                    if (!resolution.iconFunction) {
                        handleError(`Icon not found: ${iconElement.iconName}`, resolution.error, iconElement.element);
                        continue;
                    }
                    
                    // Inject the SVG
                    const injectionResult = await injector.inject(
                        iconElement.element, 
                        iconElement.iconName,
                        iconElement.modifierClasses || []
                    );
                    
                    if (injectionResult.success) {
                        injected++;
                        statistics.totalInjections++;
                        
                        // Call success callback if provided
                        if (currentConfig.onIconInjected && typeof currentConfig.onIconInjected === 'function') {
                            try {
                                currentConfig.onIconInjected(iconElement.element, iconElement.iconName);
                            } catch (callbackError) {
                                log('warn', 'Error in onIconInjected callback:', callbackError);
                            }
                        }
                    } else {
                        handleError(`Injection failed: ${iconElement.iconName}`, injectionResult.error, iconElement.element);
                    }
                    
                } catch (error) {
                    handleError(`Error processing icon: ${iconElement.iconName}`, error, iconElement.element);
                }
            }
            
            // Allow other tasks to run between batches
            if (i + batchSize < iconElements.length) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
    } catch (error) {
        handleError('Error in batch processing', error);
    }
    
    const processingTime = performance.now() - startTime;
    statistics.averageInjectionTime = ((statistics.averageInjectionTime * (statistics.totalInjections - injected)) + processingTime) / statistics.totalInjections;
    
    return injected;
}

/**
 * Scan for icons and inject them
 * @param {Element} scope - Element to scan within
 * @returns {Object} Scan and injection results
 */
async function scanAndInject(scope = null) {
    const scanScope = scope || currentConfig.scope || document;
    
    try {
        const startTime = performance.now();
        
        // Scan for icon elements
        const scanResult = scanner.scan(scanScope);
        statistics.totalScans++;
        
        const scanTime = performance.now() - startTime;
        statistics.averageScanTime = ((statistics.averageScanTime * (statistics.totalScans - 1)) + scanTime) / statistics.totalScans;
        
        log('info', `Scan found ${scanResult.validElements} icons in ${scanTime.toFixed(2)}ms`);
        
        // Process and inject icons
        const injected = await processIcons(scanResult.icons);
        
        return {
            found: scanResult.validElements,
            injected,
            scanTime,
            errors: scanResult.errors || []
        };
        
    } catch (error) {
        handleError('Error in scanAndInject', error);
        return { found: 0, injected: 0, scanTime: 0, errors: [error.message] };
    }
}

/**
 * Set up mutation observer for dynamic content using our sophisticated observer
 * @returns {IconMutationObserver} The mutation observer instance
 */
function setupMutationObserver() {
    if (!currentConfig.mutationObserver) {
        return null;
    }
    
    log('info', 'Setting up sophisticated mutation observer for dynamic content...');
    
    const observerConfig = {
        scope: currentConfig.scope || document.body,
        prefix: currentConfig.prefix,
        debounceDelay: currentConfig.debounceDelay,
        enableLogging: currentConfig.enableLogging,
        onIconsDetected: (info) => {
            log('info', `Mutation observer processed ${info.processedCount}/${info.totalElements} icons in ${info.processingTime.toFixed(2)}ms`);
            
            // Update our statistics
            statistics.totalInjections += info.processedCount;
            
            // Call user callback if provided
            if (currentConfig.onIconInjected && typeof currentConfig.onIconInjected === 'function') {
                info.elements.forEach((element, index) => {
                    if (index < info.processedCount) { // Only call for successfully processed icons
                        try {
                            // Extract icon name from class
                            const iconClass = Array.from(element.classList).find(cls => cls.startsWith(currentConfig.prefix));
                            const iconName = iconClass ? iconClass.substring(currentConfig.prefix.length) : 'unknown';
                            currentConfig.onIconInjected(element, iconName);
                        } catch (callbackError) {
                            log('warn', 'Error in onIconInjected callback:', callbackError);
                        }
                    }
                });
            }
        },
        onError: (error) => {
            handleError('Mutation observer error', error);
        }
    };
    
    const observer = new IconMutationObserver(observerConfig);
    const success = observer.start();
    
    if (success) {
        log('info', 'Sophisticated mutation observer started successfully');
        return observer;
    } else {
        log('error', 'Failed to start sophisticated mutation observer');
        return null;
    }
}

/**
 * Initialize the class-based icon system
 * @param {ClassBasedConfig} config - Configuration options
 * @returns {Promise<InitializationResult>} Initialization result
 */
export async function initializeClassBasedIcons(config = {}) {
    const startTime = performance.now();
    
    try {
        // Merge configuration
        currentConfig = { ...DEFAULT_CONFIG, ...config };
        
        // Validate configuration
        if (!currentConfig.scope) {
            throw new Error('No valid scope provided - requires DOM environment');
        }
        
        log('info', 'Initializing class-based icon system...', currentConfig);
        
        // Create instances
        scanner = new IconScanner({
            prefix: currentConfig.prefix,
            scope: currentConfig.scope
        });
        
        injector = new SVGInjector({
            preserveClasses: currentConfig.preserveClasses,
            themeIntegration: currentConfig.themeIntegration,
            sizes: currentConfig.sizes,
            colors: currentConfig.colors
        });
        
        resolver = createResolver({
            prefix: currentConfig.prefix,
            fallbackIcon: currentConfig.fallbackIcon,
            strictMode: false,
            cacheResults: true
        });
        
        // Perform initial scan and injection
        const result = await scanAndInject();
        
        // Set up mutation observer if enabled
        if (currentConfig.mutationObserver) {
            mutationObserver = setupMutationObserver();
        }
        
        isInitialized = true;
        const initTime = performance.now() - startTime;
        
        log('info', `Initialization complete in ${initTime.toFixed(2)}ms`, {
            found: result.found,
            injected: result.injected
        });
        
        return {
            success: true,
            iconsFound: result.found,
            iconsInjected: result.injected,
            initTime,
            errors: result.errors,
            config: currentConfig
        };
        
    } catch (error) {
        const initTime = performance.now() - startTime;
        handleError('Initialization failed', error);
        
        return {
            success: false,
            iconsFound: 0,
            iconsInjected: 0,
            initTime,
            errors: [error.message],
            config: currentConfig
        };
    }
}

/**
 * Re-scan and inject icons (useful for dynamic content)
 * @param {Element} scope - Optional scope to scan within
 * @returns {Promise<Object>} Scan and injection results
 */
export async function rescanIcons(scope = null) {
    if (!isInitialized) {
        throw new Error('Class-based icons not initialized. Call initializeClassBasedIcons() first.');
    }
    
    log('info', 'Manual rescan requested');
    return await scanAndInject(scope);
}

/**
 * Register icons for use with the class-based system
 * @param {Object} icons - Object with icon names and functions
 * @returns {number} Number of successfully registered icons
 */
export function registerIconsForClassBased(icons) {
    if (!resolver) {
        // Create temporary resolver for registration
        resolver = createResolver();
    }
    
    const registered = registerIcons(icons);
    log('info', `Registered ${registered} icons for class-based system`);
    
    return registered;
}

/**
 * Destroy the class-based icon system and clean up
 * @returns {Object} Cleanup statistics
 */
export function destroyClassBasedIcons() {
    const stats = { ...statistics };
    
    // Disconnect mutation observer
    if (mutationObserver) {
        if (typeof mutationObserver.stop === 'function') {
            // Using our IconMutationObserver class
            mutationObserver.stop();
        } else {
            // Using native MutationObserver
            mutationObserver.disconnect();
        }
        mutationObserver = null;
    }
    
    // Clear instances
    scanner = null;
    injector = null;
    resolver = null;
    currentConfig = null;
    isInitialized = false;
    
    // Reset statistics
    statistics = {
        totalScans: 0,
        totalInjections: 0,
        totalErrors: 0,
        averageScanTime: 0,
        averageInjectionTime: 0
    };
    
    log('info', 'Class-based icon system destroyed');
    
    return stats;
}

/**
 * Get current statistics
 * @returns {Object} Current system statistics
 */
export function getStatistics() {
    return {
        ...statistics,
        isInitialized,
        config: currentConfig ? { ...currentConfig } : null
    };
}

/**
 * Check if the system is initialized
 * @returns {boolean} True if initialized
 */
export function isClassBasedInitialized() {
    return isInitialized;
}

/**
 * Auto-initialize on DOM ready if enabled
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Auto-initialize when DOM is ready
    function autoInit() {
        if (DEFAULT_CONFIG.autoInit && !isInitialized) {
            initializeClassBasedIcons().catch(error => {
                console.error('Auto-initialization failed:', error);
            });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        // DOM is already ready
        setTimeout(autoInit, 0);
    }
}

/**
 * Export main initialization function and utilities
 */
export {
    registerIcon,
    registerIcons,
    resolveIcon,
    scanForIcons,
    DEFAULT_CONFIG
};

/**
 * Default export
 */
export default initializeClassBasedIcons;
