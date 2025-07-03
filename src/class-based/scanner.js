/**
 * SVA Icons Class-Based API - Core Class Scanner
 * 
 * This module provides efficient DOM scanning functionality to find elements
 * with sva-icon-* classes for the class-based icon injection system.
 * 
 * Performance optimized for large DOMs with 1000+ elements.
 * Target: < 10ms for 1000+ elements
 * 
 * @module scanner
 * @version 2.2.0
 * @author SVA Icons Team
 */

/**
 * Configuration for the class scanner
 * @typedef {Object} ScannerConfig
 * @property {string} attributeName - Data attribute name to scan for (default: 'data-sva-icon')
 * @property {Element} scope - Root element to scan within (default: document)
 * @property {boolean} includeInvisible - Include hidden elements (default: true)
 * @property {number} batchSize - Number of elements to process in each batch (default: 100)
 */

/**
 * Information about a found icon element
 * @typedef {Object} IconElement
 * @property {Element} element - The DOM element
 * @property {string} iconName - Extracted icon name (e.g., 'plus', 'arrow-right')
 * @property {string[]} modifiers - Modifier classes (e.g., ['large', 'primary'])
 * @property {boolean} isValid - Whether the icon name is valid
 */

/**
 * Scanner result containing found elements and performance metrics
 * @typedef {Object} ScanResult
 * @property {IconElement[]} icons - Array of found icon elements
 * @property {number} totalElements - Total elements scanned
 * @property {number} matchedElements - Number of elements with data attributes
 * @property {number} validElements - Number of elements with valid icon names
 * @property {number} scanTime - Time taken to scan in milliseconds
 * @property {string[]} errors - Array of error messages for invalid elements
 */

/**
 * Default scanner configuration
 */
const DEFAULT_CONFIG = {
    attributeName: 'data-sva-icon',
    scope: typeof document !== 'undefined' ? document : null,
    includeInvisible: true,
    batchSize: 100
};

/**
 * Regular expression patterns for validation
 */
const PATTERNS = {
    // Valid icon name pattern (kebab-case)
    validIconName: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

/**
 * Core data attribute scanner implementation
 */
class IconScanner {
    /**
     * Create a new icon scanner for data attributes
     * @param {ScannerConfig} config - Scanner configuration
     */
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.cache = new Map(); // Cache for performance optimization
        this.performanceMetrics = {
            totalScans: 0,
            totalTime: 0,
            averageTime: 0
        };
    }

    /**
     * Scan for icon elements within the configured scope
     * @param {Element} [customScope] - Custom scope to scan within
     * @returns {ScanResult} Scan results with found icons and metrics
     */
    scan(customScope = null) {
        const startTime = performance.now();
        const scope = customScope || this.config.scope;
        
        if (!scope) {
            throw new Error('Scanner scope is not available. Ensure DOM is ready or provide custom scope.');
        }

        const result = {
            icons: [],
            totalElements: 0,
            matchedElements: 0,
            validElements: 0,
            scanTime: 0,
            errors: []
        };

        try {
            // Use optimized CSS selector for better performance
            const selector = this._buildOptimizedSelector();
            const elements = scope.querySelectorAll(selector);
            
            result.totalElements = elements.length;
            result.matchedElements = elements.length;

            // Process elements in batches for better performance
            const batches = this._createBatches(elements, this.config.batchSize);
            
            for (const batch of batches) {
                const batchResults = this._processBatch(batch);
                result.icons.push(...batchResults.icons);
                result.validElements += batchResults.validCount;
                result.errors.push(...batchResults.errors);
            }

            const endTime = performance.now();
            result.scanTime = endTime - startTime;

            // Update performance metrics
            this._updatePerformanceMetrics(result.scanTime);

            return result;

        } catch (error) {
            result.errors.push(`Scanner error: ${error.message}`);
            result.scanTime = performance.now() - startTime;
            return result;
        }
    }

    /**
     * Scan for a specific icon name
     * @param {string} iconName - Icon name to search for
     * @param {Element} [scope] - Scope to search within
     * @returns {IconElement[]} Array of elements with the specified icon
     */
    scanForIcon(iconName, scope = null) {
        if (!this._isValidIconName(iconName)) {
            throw new Error(`Invalid icon name: ${iconName}`);
        }

        const searchScope = scope || this.config.scope;
        const className = `${this.config.prefix}${iconName}`;
        const elements = searchScope.querySelectorAll(`.${className}`);

        return Array.from(elements).map(element => this._analyzeElement(element));
    }

    /**
     * Check if an element has valid data attribute
     * @param {Element} element - Element to check
     * @returns {boolean} True if element has valid data attribute
     */
    hasValidDataAttribute(element) {
        if (!element) {
            return false;
        }

        const iconName = element.getAttribute(this.config.attributeName);
        return iconName && this._isValidIconName(iconName.trim());
    }

    /**
     * Extract icon information from an element
     * @param {Element} element - Element to analyze
     * @returns {IconElement} Icon element information
     */
    analyzeElement(element) {
        return this._analyzeElement(element);
    }

    /**
     * Get performance metrics for the scanner
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    /**
     * Clear the internal cache (useful for testing or memory management)
     */
    clearCache() {
        this.cache.clear();
    }

    // Private methods

    /**
     * Build optimized CSS selector for finding data attribute elements
     * @private
     * @returns {string} CSS selector
     */
    _buildOptimizedSelector() {
        // Use data attribute selector for efficient element matching
        return `[${this.config.attributeName}]`;
    }

    /**
     * Create batches of elements for processing
     * @private
     * @param {NodeList} elements - Elements to batch
     * @param {number} batchSize - Size of each batch
     * @returns {Array[]} Array of element batches
     */
    _createBatches(elements, batchSize) {
        const batches = [];
        const elementsArray = Array.from(elements);
        
        for (let i = 0; i < elementsArray.length; i += batchSize) {
            batches.push(elementsArray.slice(i, i + batchSize));
        }
        
        return batches;
    }

    /**
     * Process a batch of elements
     * @private
     * @param {Element[]} batch - Batch of elements to process
     * @returns {Object} Batch processing results
     */
    _processBatch(batch) {
        const icons = [];
        const errors = [];
        let validCount = 0;

        for (const element of batch) {
            try {
                // Skip already processed elements to prevent infinite loops
                if (element.hasAttribute('data-sva-processed') || element.querySelector('svg')) {
                    continue;
                }
                
                const iconElement = this._analyzeElement(element);
                if (iconElement.isValid) {
                    icons.push(iconElement);
                    validCount++;
                } else if (iconElement.iconName) {
                    // Element has icon class but it's invalid
                    errors.push(`Invalid icon class found on element: ${iconElement.iconName}`);
                }
            } catch (error) {
                errors.push(`Error analyzing element: ${error.message}`);
            }
        }

        return { icons, validCount, errors };
    }

    /**
     * Analyze a single element for icon information from data attributes
     * @private
     * @param {Element} element - Element to analyze
     * @returns {IconElement} Icon element information
     */
    _analyzeElement(element) {
        const iconElement = {
            element,
            iconName: null,
            modifiers: [],
            isValid: false
        };

        if (!element) {
            return iconElement;
        }

        // Extract icon name from data attribute
        const iconName = element.getAttribute(this.config.attributeName);
        
        if (iconName) {
            iconElement.iconName = iconName.trim();
            iconElement.isValid = this._isValidIconName(iconElement.iconName);
        }

        // Extract size modifiers from CSS classes for theming
        if (element.classList) {
            const classes = Array.from(element.classList);
            for (const className of classes) {
                if (className.match(/^sva-icon--(xs|s|m|l|xl)$/)) {
                    const modifier = className.replace(/^sva-icon--/, '');
                    iconElement.modifiers.push(modifier);
                }
            }
        }

        return iconElement;
    }

    /**
     * Validate icon name format
     * @private
     * @param {string} iconName - Icon name to validate
     * @returns {boolean} True if valid
     */
    _isValidIconName(iconName) {
        if (!iconName || typeof iconName !== 'string') {
            return false;
        }
        return PATTERNS.validIconName.test(iconName);
    }

    /**
     * Update performance metrics
     * @private
     * @param {number} scanTime - Time taken for the scan
     */
    _updatePerformanceMetrics(scanTime) {
        this.performanceMetrics.totalScans++;
        this.performanceMetrics.totalTime += scanTime;
        this.performanceMetrics.averageTime = 
            this.performanceMetrics.totalTime / this.performanceMetrics.totalScans;
    }
}

/**
 * Create a new icon scanner instance
 * @param {ScannerConfig} config - Scanner configuration
 * @returns {IconScanner} New scanner instance
 */
export function createScanner(config) {
    return new IconScanner(config);
}

/**
 * Quick scan function for immediate use
 * @param {ScannerConfig} config - Scanner configuration
 * @returns {ScanResult} Scan results
 */
export function scanForIcons(config = {}) {
    const scanner = new IconScanner(config);
    return scanner.scan();
}

/**
 * Utility function to check if an element has valid data attribute
 * @param {Element} element - Element to check
 * @param {string} attributeName - Data attribute name (default: 'data-sva-icon')
 * @returns {boolean} True if element has valid data attribute
 */
export function hasDataAttribute(element, attributeName = 'data-sva-icon') {
    const scanner = new IconScanner({ attributeName });
    return scanner.hasValidDataAttribute(element);
}

/**
 * Export the main scanner class
 */
export { IconScanner };

/**
 * Export patterns for external validation
 */
export { PATTERNS };

// Default export
export default {
    IconScanner,
    createScanner,
    scanForIcons,
    hasDataAttribute,
    PATTERNS
};
