/**
 * SVA Icons Class-Based API - SVG Injection Engine
 * 
 * This module handles the injection of SVG content into DOM elements
 * that have been identified as icon elements by the scanner.
 * 
 * Features:
 * - Preserves existing element attributes
 * - Applies modifier classes for styling
 * - Handles accessibility attributes
 * - Performance optimized for batch processing
 * 
 * Target: < 1ms per icon injection
 * 
 * @module injector
 * @version 2.2.0
 * @author SVA Icons Team
 */

/**
 * Configuration for the SVG injector
 * @typedef {Object} InjectorConfig
 * @property {boolean} preserveClasses - Keep original classes on SVG (default: true)
 * @property {boolean} addAccessibility - Auto-add accessibility attributes (default: true)
 * @property {boolean} validateSVG - Validate SVG content before injection (default: true)
 * @property {string} fallbackIcon - Icon to use when target icon is not found
 * @property {Object} defaultAttributes - Default attributes to add to all SVGs
 */

/**
 * Result of an injection operation
 * @typedef {Object} InjectionResult
 * @property {boolean} success - Whether the injection succeeded
 * @property {Element} element - The original element
 * @property {Element} svgElement - The injected SVG element
 * @property {string} iconName - Name of the injected icon
 * @property {string[]} appliedModifiers - Modifiers that were applied
 * @property {string} error - Error message if injection failed
 * @property {number} injectionTime - Time taken for injection in milliseconds
 */

/**
 * Information about an available icon
 * @typedef {Object} IconInfo
 * @property {string} name - Icon name
 * @property {Function} renderer - Function that returns SVG string
 * @property {Object} metadata - Icon metadata (size, categories, etc.)
 */

import { IconScanner } from './scanner.js';
import { getIcon, hasIcon as resolverHasIcon, getRegisteredIcons } from './resolver.js';

/**
 * Default injector configuration
 */
const DEFAULT_CONFIG = {
    preserveClasses: true,
    addAccessibility: true,
    validateSVG: true,
    fallbackIcon: null,
    defaultAttributes: {
        'aria-hidden': 'true',
        'focusable': 'false',
        'stroke': 'none'
    }
};

/**
 * Cache for rendered SVG strings to improve performance
 */
const SVG_CACHE = new Map();

/**
 * Registry of available icon functions
 * This will be populated by the initialization module
 */
let ICON_REGISTRY = new Map();

/**
 * SVG Injection Engine
 */
class SVGInjector {
    /**
     * Create a new SVG injector
     * @param {InjectorConfig} config - Injector configuration
     */
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.performanceMetrics = {
            totalInjections: 0,
            totalTime: 0,
            averageTime: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }

    /**
     * Register icon functions for injection
     * @param {Map|Object} icons - Icon functions to register
     */
    registerIcons(icons) {
        if (icons instanceof Map) {
            for (const [name, iconFunction] of icons) {
                ICON_REGISTRY.set(name, iconFunction);
            }
        } else if (typeof icons === 'object') {
            for (const [name, iconFunction] of Object.entries(icons)) {
                ICON_REGISTRY.set(name, iconFunction);
            }
        }
    }

    /**
     * Inject SVG into a single element
     * @param {Element} element - Element to inject SVG into
     * @param {string} iconName - Name of the icon to inject
     * @param {string[]} modifiers - Modifier classes to apply
     * @returns {InjectionResult} Result of the injection
     */
    inject(element, iconName, modifiers = []) {
        const startTime = performance.now();
        
        // MORE AGGRESSIVE checks to prevent infinite loops
        if (!element || !element.tagName) {
            return {
                success: false,
                element,
                svgElement: null,
                iconName,
                appliedModifiers: [],
                error: 'Invalid element provided',
                injectionTime: performance.now() - startTime
            };
        }

        // Skip if element already contains SVG content or is being processed
        if (element.querySelector('svg') || 
            element.hasAttribute('data-sva-processed') || 
            element.hasAttribute('data-sva-injecting') ||
            element.innerHTML.trim().includes('<svg') ||
            element.tagName === 'svg' ||
            element.tagName === 'SVG') {
            
            return {
                success: false,
                element,
                svgElement: null,
                iconName,
                appliedModifiers: [],
                error: 'Element already processed, being processed, or contains SVG',
                injectionTime: performance.now() - startTime
            };
        }
        
        const result = {
            success: false,
            element,
            svgElement: null,
            iconName,
            appliedModifiers: [],
            error: null,
            injectionTime: 0
        };

        try {
            // Get the icon function from registry
            const iconFunction = this._getIconFunction(iconName);
            if (!iconFunction) {
                throw new Error(`Icon '${iconName}' not found in registry`);
            }

            // Generate SVG content
            const svgContent = this._generateSVGContent(iconFunction, modifiers);
            if (!svgContent) {
                throw new Error(`Failed to generate SVG for icon '${iconName}'`);
            }

            // Create SVG element
            const svgElement = this._createSVGElement(svgContent);
            if (!svgElement) {
                throw new Error(`Failed to create SVG element for icon '${iconName}'`);
            }

            // Preserve original element attributes
            this._preserveAttributes(element, svgElement);

            // Apply modifier classes and styles
            const appliedModifiers = this._applyModifiers(svgElement, modifiers);

            // Add accessibility attributes
            if (this.config.addAccessibility) {
                this._addAccessibilityAttributes(svgElement, element, iconName);
            }

            // Replace element content
            this._replaceElementContent(element, svgElement);

            // Update result
            result.success = true;
            result.svgElement = svgElement;
            result.appliedModifiers = appliedModifiers;

            // Update performance metrics
            const endTime = performance.now();
            result.injectionTime = endTime - startTime;
            this._updatePerformanceMetrics(result.injectionTime, true);

            return result;

        } catch (error) {
            result.error = error.message;
            result.injectionTime = performance.now() - startTime;
            this._updatePerformanceMetrics(result.injectionTime, false);
            
            // Try fallback icon if configured
            if (this.config.fallbackIcon && iconName !== this.config.fallbackIcon) {
                return this.inject(element, this.config.fallbackIcon, modifiers);
            }
            
            return result;
        }
    }

    /**
     * Process an icon element for mutation observer compatibility
     * @param {Element} element - Element to process
     * @returns {Promise<boolean>} True if processing succeeded
     */
    async processIcon(element) {
        if (!element || !element.classList) {
            return false;
        }

        // Find the icon class
        const iconClass = Array.from(element.classList).find(cls => cls.startsWith('sva-icon-'));
        if (!iconClass) {
            return false;
        }

        // Extract icon name from class (remove 'sva-icon-' prefix)
        const iconName = iconClass.substring('sva-icon-'.length);
        
        // Extract modifier classes
        const modifierClasses = Array.from(element.classList).filter(cls => 
            cls.startsWith('sva-icon--') || cls.includes('sva-icon')
        );

        try {
            // Use the main inject method
            const result = this.inject(element, iconName, modifierClasses);
            return result.success;
        } catch (error) {
            console.error(`[SVA Icons] Failed to process icon element:`, error);
            return false;
        }
    }

    /**
     * Inject SVGs into multiple elements efficiently
     * @param {Array} iconElements - Array of {element, iconName, modifiers} objects
     * @returns {InjectionResult[]} Array of injection results
     */
    injectBatch(iconElements) {
        const results = [];
        
        // Pre-warm cache for unique icons
        const uniqueIcons = new Set(iconElements.map(item => item.iconName));
        this._preWarmCache(uniqueIcons);

        // Process each element
        for (const { element, iconName, modifiers } of iconElements) {
            const result = this.inject(element, iconName, modifiers);
            results.push(result);
        }

        return results;
    }

    /**
     * Check if an icon is available in the registry
     * @param {string} iconName - Icon name to check
     * @returns {boolean} True if icon is available
     */
    hasIcon(iconName) {
        return resolverHasIcon(iconName);
    }

    /**
     * Get list of all available icons
     * @returns {string[]} Array of available icon names
     */
    getAvailableIcons() {
        return getRegisteredIcons();
    }

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    /**
     * Clear the SVG cache
     */
    clearCache() {
        SVG_CACHE.clear();
    }

    // Private methods

    /**
     * Get icon function from registry
     * @private
     * @param {string} iconName - Icon name
     * @returns {Function|null} Icon function or null if not found
     */
    _getIconFunction(iconName) {
        // Use the resolver's getIcon function instead of our own registry
        const iconFunction = getIcon(iconName);
        return iconFunction;
    }

    /**
     * Generate SVG content using icon function and modifiers
     * @private
     * @param {Function} iconFunction - Icon function
     * @param {string[]} modifiers - Modifier classes
     * @returns {string} SVG content string
     */
    _generateSVGContent(iconFunction, modifiers) {
        // Create cache key - use a fallback if function name is not available
        const functionName = iconFunction?.name || iconFunction?.toString?.()?.slice(0, 20) || 'unnamed';
        const cacheKey = `${functionName}-${modifiers.sort().join('-')}`;
        
        // Check cache first
        if (SVG_CACHE.has(cacheKey)) {
            this.performanceMetrics.cacheHits++;
            return SVG_CACHE.get(cacheKey);
        }

        this.performanceMetrics.cacheMisses++;

        try {
            // Convert modifiers to props for icon function
            const props = this._modifiersToProps(modifiers);
            
            // Call icon function to get SVG
            const svgContent = iconFunction(props);
            
            // Validate SVG if configured
            if (this.config.validateSVG && !this._isValidSVG(svgContent)) {
                throw new Error('Generated SVG content is invalid');
            }

            // Cache the result
            SVG_CACHE.set(cacheKey, svgContent);
            
            return svgContent;

        } catch (error) {
            throw new Error(`Failed to generate SVG: ${error.message}`);
        }
    }

    /**
     * Convert modifier classes to props for icon function
     * @private
     * @param {string[]} modifiers - Modifier classes
     * @returns {Object} Props object for icon function
     */
    _modifiersToProps(modifiers) {
        const props = {
            // Default: no stroke for fill-based icons
            stroke: 'none',
            strokeWidth: 0,
            // Ensure these override the function defaults
            'stroke-width': 0
        };

        for (const modifier of modifiers) {
            // Size modifiers
            if (['xs', 's', 'm', 'l', 'xl'].includes(modifier)) {
                props.size = this._sizeModifierToPixels(modifier);
            }
            
            // Color modifiers
            if (['primary', 'secondary', 'success', 'warning', 'error', 'inverse'].includes(modifier)) {
                props.color = `var(--sva-icon-color-${modifier})`;
            }
        }

        return props;
    }

    /**
     * Convert size modifier to pixel value
     * @private
     * @param {string} sizeModifier - Size modifier (xs, s, m, l, xl)
     * @returns {number} Size in pixels
     */
    _sizeModifierToPixels(sizeModifier) {
        const sizeMap = {
            xs: 12,
            s: 16,
            m: 24,
            l: 32,
            xl: 48
        };
        return sizeMap[sizeModifier] || 24;
    }

    /**
     * Create SVG element from content string
     * @private
     * @param {string} svgContent - SVG content string
     * @returns {Element} SVG element
     */
    _createSVGElement(svgContent) {
        // Create a temporary container
        const temp = document.createElement('div');
        temp.innerHTML = svgContent.trim();
        
        // Get the SVG element
        const svgElement = temp.querySelector('svg');
        
        if (!svgElement) {
            throw new Error('No SVG element found in content');
        }

        // Force remove stroke attributes for fill-based icons
        svgElement.setAttribute('stroke', 'none');
        svgElement.setAttribute('stroke-width', '0');
        svgElement.removeAttribute('strokeWidth'); // in case it exists

        return svgElement;
    }

    /**
     * Preserve attributes from original element to SVG
     * @private
     * @param {Element} originalElement - Original element
     * @param {Element} svgElement - SVG element
     */
    _preserveAttributes(originalElement, svgElement) {
        if (!this.config.preserveClasses) return;

        // Preserve important attributes
        const attributesToPreserve = ['id', 'data-*', 'aria-*', 'title'];
        
        for (const attr of originalElement.attributes) {
            const name = attr.name;
            const value = attr.value;

            // Skip class attribute (handled separately)
            if (name === 'class') continue;

            // Check if this attribute should be preserved
            const shouldPreserve = attributesToPreserve.some(pattern => {
                if (pattern.endsWith('*')) {
                    return name.startsWith(pattern.slice(0, -1));
                }
                return name === pattern;
            });

            if (shouldPreserve) {
                svgElement.setAttribute(name, value);
            }
        }

        // Merge classes
        const originalClasses = Array.from(originalElement.classList);
        const svgClasses = Array.from(svgElement.classList);
        const allClasses = [...new Set([...originalClasses, ...svgClasses])];
        
        // Use setAttribute for SVG elements instead of className
        svgElement.setAttribute('class', allClasses.join(' '));
    }

    /**
     * Apply modifier classes to SVG element
     * @private
     * @param {Element} svgElement - SVG element
     * @param {string[]} modifiers - Modifier classes
     * @returns {string[]} Applied modifiers
     */
    _applyModifiers(svgElement, modifiers) {
        const appliedModifiers = [];

        for (const modifier of modifiers) {
            const className = `sva-icon--${modifier}`;
            if (!svgElement.classList.contains(className)) {
                svgElement.classList.add(className);
                appliedModifiers.push(modifier);
            }
        }

        // Always add base icon class
        if (!svgElement.classList.contains('sva-icon')) {
            svgElement.classList.add('sva-icon');
        }

        return appliedModifiers;
    }

    /**
     * Add accessibility attributes to SVG
     * @private
     * @param {Element} svgElement - SVG element
     * @param {Element} originalElement - Original element
     * @param {string} iconName - Icon name
     */
    _addAccessibilityAttributes(svgElement, originalElement, iconName) {
        // Add default attributes
        for (const [name, value] of Object.entries(this.config.defaultAttributes)) {
            if (!svgElement.hasAttribute(name)) {
                svgElement.setAttribute(name, value);
            }
        }

        // Preserve existing accessibility attributes
        const existingAriaLabel = originalElement.getAttribute('aria-label');
        const existingTitle = originalElement.getAttribute('title');
        
        if (existingAriaLabel) {
            svgElement.setAttribute('aria-label', existingAriaLabel);
            svgElement.removeAttribute('aria-hidden');
        } else if (existingTitle) {
            svgElement.setAttribute('aria-label', existingTitle);
            svgElement.removeAttribute('aria-hidden');
        }

        // Add role if not present
        if (!svgElement.hasAttribute('role')) {
            svgElement.setAttribute('role', 'img');
        }
    }

    /**
     * Replace element content with SVG
     * @private
     * @param {Element} element - Original element
     * @param {Element} svgElement - SVG element to inject
     */
    _replaceElementContent(element, svgElement) {
        // Mark element as processed FIRST to prevent any recursive processing
        element.setAttribute('data-sva-processed', 'true');
        element.setAttribute('data-sva-injecting', 'true');
        
        // Clear existing content
        element.innerHTML = '';
        
        // Append SVG
        element.appendChild(svgElement);
        
        // Remove the injecting flag with a slight delay to ensure
        // the mutation observer sees it during processing
        setTimeout(() => {
            element.removeAttribute('data-sva-injecting');
        }, 100); // Increased delay to ensure proper filtering
    }

    /**
     * Validate SVG content
     * @private
     * @param {string} svgContent - SVG content to validate
     * @returns {boolean} True if valid
     */
    _isValidSVG(svgContent) {
        if (!svgContent || typeof svgContent !== 'string') {
            return false;
        }

        // Basic SVG validation
        return svgContent.trim().startsWith('<svg') && svgContent.includes('</svg>');
    }

    /**
     * Pre-warm cache for a set of icons
     * @private
     * @param {Set} iconNames - Set of icon names to pre-warm
     */
    _preWarmCache(iconNames) {
        for (const iconName of iconNames) {
            const iconFunction = this._getIconFunction(iconName);
            if (iconFunction && !SVG_CACHE.has(iconName)) {
                try {
                    const svgContent = iconFunction();
                    SVG_CACHE.set(iconName, svgContent);
                } catch (error) {
                    // Ignore pre-warming errors
                }
            }
        }
    }

    /**
     * Update performance metrics
     * @private
     * @param {number} injectionTime - Time taken for injection
     * @param {boolean} success - Whether injection succeeded
     */
    _updatePerformanceMetrics(injectionTime, success) {
        if (success) {
            this.performanceMetrics.totalInjections++;
            this.performanceMetrics.totalTime += injectionTime;
            this.performanceMetrics.averageTime = 
                this.performanceMetrics.totalTime / this.performanceMetrics.totalInjections;
        }
    }
}

/**
 * Create a new SVG injector instance
 * @param {InjectorConfig} config - Injector configuration
 * @returns {SVGInjector} New injector instance
 */
export function createInjector(config) {
    return new SVGInjector(config);
}

/**
 * Quick injection function for single element
 * @param {Element} element - Element to inject into
 * @param {string} iconName - Icon name
 * @param {string[]} modifiers - Modifier classes
 * @param {InjectorConfig} config - Injector configuration
 * @returns {InjectionResult} Injection result
 */
export function injectIcon(element, iconName, modifiers = [], config = {}) {
    const injector = new SVGInjector(config);
    return injector.inject(element, iconName, modifiers);
}

/**
 * Utility function to register global icons
 * @param {Map|Object} icons - Icons to register globally
 */
export function registerGlobalIcons(icons) {
    if (icons instanceof Map) {
        for (const [name, iconFunction] of icons) {
            ICON_REGISTRY.set(name, iconFunction);
        }
    } else if (typeof icons === 'object') {
        for (const [name, iconFunction] of Object.entries(icons)) {
            ICON_REGISTRY.set(name, iconFunction);
        }
    }
}

/**
 * Get the global icon registry
 * @returns {Map} Icon registry
 */
export function getIconRegistry() {
    return ICON_REGISTRY;
}

/**
 * Clear the global icon registry
 */
export function clearIconRegistry() {
    ICON_REGISTRY.clear();
}

/**
 * Export the main injector class
 */
export { SVGInjector };

// Default export
export default {
    SVGInjector,
    createInjector,
    injectIcon,
    registerGlobalIcons,
    getIconRegistry,
    clearIconRegistry
};
