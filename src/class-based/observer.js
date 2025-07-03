/**
 * SVA Icons Class-Based API - Mutation Observer Support
 * 
 * This module provides dynamic content monitoring for Single Page Applications (SPAs)
 * using the MutationObserver API. It watches for DOM changes and automatically
 * processes new icon elements that are added dynamically.
 * 
 * Features:
 * - Detects dynamically added icon elements using data attributes
 * - Debounced processing for performance optimization
 * - SPA framework compatibility (React, Vue, Angular)
 * - Proper cleanup on disconnect
 * - Edge case handling (removed elements, invalid mutations)
 * 
 * Performance Target: Debounced processing < 50ms
 * 
 * @module observer
 * @version 2.2.0
 * @author SVA Icons Team
 */

import { scanForIcons } from './scanner.js';
import { SVGInjector } from './injector.js';

/**
 * Configuration for the mutation observer
 * @typedef {Object} ObserverConfig
 * @property {Element} scope - Root element to observe (default: document.body)
 * @property {string} attributeName - Data attribute name to watch for (default: 'data-sva-icon')
 * @property {number} debounceDelay - Debounce delay in milliseconds (default: 50)
 * @property {boolean} observeAttributes - Watch for data attribute changes (default: true)
 * @property {boolean} observeCharacterData - Watch for text content changes (default: false)
 * @property {boolean} subtree - Observe all descendant nodes (default: true)
 * @property {Function} onIconsDetected - Callback when new icons are detected
 * @property {Function} onError - Error callback
 * @property {boolean} enableLogging - Enable console logging (default: false)
 */

/**
 * Information about observed mutations
 * @typedef {Object} MutationInfo
 * @property {number} addedNodes - Number of nodes added
 * @property {number} removedNodes - Number of nodes removed
 * @property {number} attributeChanges - Number of attribute changes
 * @property {number} newIcons - Number of new icon elements found
 * @property {Element[]} iconElements - Array of new icon elements
 */

/**
 * Default observer configuration
 */
const DEFAULT_CONFIG = {
    scope: typeof document !== 'undefined' && document.body ? document.body : null,
    attributeName: 'data-sva-icon',
    debounceDelay: 50,
    observeAttributes: true,
    observeCharacterData: false,
    subtree: true,
    onIconsDetected: null,
    onError: null,
    enableLogging: false
};

/**
 * SVA Icons Mutation Observer
 * 
 * Watches for DOM changes and automatically processes new icon elements.
 * Optimized for SPA frameworks with debounced processing.
 */
export class IconMutationObserver {
    /**
     * Create a new IconMutationObserver
     * @param {ObserverConfig} config - Observer configuration
     */
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.observer = null;
        this.injector = new SVGInjector();
        this.isObserving = false;
        this.debounceTimer = null;
        this.pendingMutations = [];
        this.statistics = {
            totalMutations: 0,
            totalIconsProcessed: 0,
            totalProcessingTime: 0,
            lastProcessedAt: null
        };

        // Validate configuration
        this._validateConfig();

        // Bind methods to preserve context
        this._handleMutations = this._handleMutations.bind(this);
        this._processPendingMutations = this._processPendingMutations.bind(this);
    }

    /**
     * Start observing DOM mutations
     * @returns {boolean} True if observer started successfully
     */
    start() {
        if (this.isObserving) {
            this._log('Observer is already running');
            return true;
        }

        if (!this.config.scope) {
            this._error('Cannot start observer: no scope element provided');
            return false;
        }

        if (!window.MutationObserver) {
            this._error('MutationObserver is not supported in this browser');
            return false;
        }

        try {
            // Create the MutationObserver
            this.observer = new MutationObserver(this._handleMutations);

            // Configure observer options for data attributes
            const observerOptions = {
                childList: true,
                subtree: this.config.subtree,
                attributes: this.config.observeAttributes,
                attributeFilter: this.config.observeAttributes ? [this.config.attributeName] : undefined,
                characterData: this.config.observeCharacterData
            };

            // Start observing
            this.observer.observe(this.config.scope, observerOptions);
            this.isObserving = true;

            this._log('Mutation observer started successfully', {
                scope: this.config.scope.tagName || 'document',
                attributeName: this.config.attributeName,
                options: observerOptions
            });

            return true;
        } catch (error) {
            this._error('Failed to start mutation observer:', error);
            return false;
        }
    }

    /**
     * Stop observing DOM mutations
     * @returns {boolean} True if observer stopped successfully
     */
    stop() {
        if (!this.isObserving) {
            this._log('Observer is not running');
            return true;
        }

        try {
            // Clear any pending debounced processing
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }

            // Process any remaining mutations
            if (this.pendingMutations.length > 0) {
                this._processPendingMutations();
            }

            // Disconnect the observer
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            this.isObserving = false;
            this.pendingMutations = [];

            this._log('Mutation observer stopped successfully');
            return true;
        } catch (error) {
            this._error('Failed to stop mutation observer:', error);
            return false;
        }
    }

    /**
     * Get observer statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        return {
            ...this.statistics,
            isObserving: this.isObserving,
            pendingMutations: this.pendingMutations.length,
            averageProcessingTime: this.statistics.totalMutations > 0 
                ? this.statistics.totalProcessingTime / this.statistics.totalMutations 
                : 0
        };
    }

    /**
     * Manually process a specific element and its children
     * @param {Element} element - Element to process
     * @returns {Promise<number>} Number of icons processed
     */
    async processElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return 0;
        }

        try {
            const startTime = performance.now();
            
            // Scan for icons in the element using data attributes
            const scanResult = scanForIcons({
                scope: element,
                attributeName: this.config.attributeName
            });

            // Process found icons
            let processedCount = 0;
            if (scanResult.icons.length > 0) {
                for (const iconElement of scanResult.icons) {
                    const success = await this.injector.processIcon(
                        iconElement.element, 
                        this.config.attributeName
                    );
                    if (success) {
                        processedCount++;
                    }
                }
            }

            const endTime = performance.now();
            const processingTime = endTime - startTime;

            this._log(`Manually processed ${processedCount} icons in ${processingTime.toFixed(2)}ms`);

            return processedCount;
        } catch (error) {
            this._error('Failed to process element:', error);
            return 0;
        }
    }

    /**
     * Handle MutationObserver callback
     * @private
     * @param {MutationRecord[]} mutations - Array of mutation records
     */
    _handleMutations(mutations) {
        // Filter out mutations we don't care about
        const relevantMutations = mutations.filter(mutation => {
            // Skip mutations from elements that are currently being injected or already processed
            if (mutation.target && mutation.target.hasAttribute) {
                if (mutation.target.hasAttribute('data-sva-injecting') || 
                    mutation.target.hasAttribute('data-sva-processed')) {
                    return false;
                }
            }
            
            // Skip mutations with no added nodes or relevant attribute changes
            if (mutation.type === 'childList') {
                // Only care about added nodes, not removed ones
                if (mutation.addedNodes.length === 0) {
                    return false;
                }
                
                // Skip if the added nodes are SVG elements (likely from our injection)
                const hasOnlySVGNodes = Array.from(mutation.addedNodes).every(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.tagName === 'svg' || node.tagName === 'SVG')
                );
                
                if (hasOnlySVGNodes) {
                    return false;
                }
                
                // Skip if the parent element is currently being processed
                if (mutation.target.hasAttribute && 
                    (mutation.target.hasAttribute('data-sva-injecting') || 
                     mutation.target.hasAttribute('data-sva-processed'))) {
                    return false;
                }
                
                return true;
            } else if (mutation.type === 'attributes' && mutation.attributeName === this.config.attributeName) {
                // Only care about our specific data attribute changes
                const target = mutation.target;
                if (target.hasAttribute('data-sva-processed') || 
                    target.hasAttribute('data-sva-injecting') ||
                    target.querySelector('svg')) {
                    return false;
                }
                return this._hasDataAttribute(target);
            }
            return false;
        });

        if (relevantMutations.length === 0) {
            return;
        }

        // Add to pending mutations
        this.pendingMutations.push(...relevantMutations);
        this.statistics.totalMutations += relevantMutations.length;

        // Debounce processing
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(this._processPendingMutations, this.config.debounceDelay);
    }

    /**
     * Process pending mutations (debounced)
     * @private
     */
    async _processPendingMutations() {
        if (this.pendingMutations.length === 0) {
            return;
        }

        const startTime = performance.now();
        const mutations = [...this.pendingMutations];
        this.pendingMutations = [];
        this.debounceTimer = null;

        try {
            const newIconElements = this._extractIconElements(mutations);
            
            if (newIconElements.length === 0) {
                return;
            }

            this._log(`Processing ${newIconElements.length} new icon elements from ${mutations.length} mutations`);

            // Process new icon elements
            let processedCount = 0;
            for (const element of newIconElements) {
                try {
                    const success = await this.injector.processIcon(element);
                    if (success) {
                        processedCount++;
                    }
                } catch (error) {
                    this._error('Failed to process icon element:', error);
                }
            }

            const endTime = performance.now();
            const processingTime = endTime - startTime;

            // Update statistics
            this.statistics.totalIconsProcessed += processedCount;
            this.statistics.totalProcessingTime += processingTime;
            this.statistics.lastProcessedAt = new Date();

            // Trigger callback if provided
            if (this.config.onIconsDetected) {
                this.config.onIconsDetected({
                    processedCount,
                    totalElements: newIconElements.length,
                    processingTime,
                    elements: newIconElements
                });
            }

            this._log(`Processed ${processedCount}/${newIconElements.length} icons in ${processingTime.toFixed(2)}ms`);

        } catch (error) {
            this._error('Failed to process pending mutations:', error);
        }
    }

    /**
     * Extract icon elements from mutations
     * @private
     * @param {MutationRecord[]} mutations - Array of mutations
     * @returns {Element[]} Array of icon elements
     */
    _extractIconElements(mutations) {
        const iconElements = new Set(); // Use Set to avoid duplicates

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Check added nodes for icon elements
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check the node itself
                        if (this._hasDataAttribute(node)) {
                            iconElements.add(node);
                        }

                        // Check descendants with the data attribute
                        const descendants = node.querySelectorAll(`[${this.config.attributeName}]`);
                        for (const descendant of descendants) {
                            if (this._hasDataAttribute(descendant)) {
                                iconElements.add(descendant);
                            }
                        }
                    }
                }
            } else if (mutation.type === 'attributes' && mutation.attributeName === this.config.attributeName) {
                // Check if data attribute change added icon attribute
                if (this._hasDataAttribute(mutation.target)) {
                    iconElements.add(mutation.target);
                }
            }
        }

        return Array.from(iconElements);
    }

    /**
     * Check if element has the data attribute for icons
     * @private
     * @param {Element} element - Element to check
     * @returns {boolean} True if element has data attribute
     */
    _hasDataAttribute(element) {
        if (!element || !element.hasAttribute) {
            return false;
        }

        // Skip elements that are currently being processed, already processed, or contain SVG
        if (element.hasAttribute('data-sva-injecting') || 
            element.hasAttribute('data-sva-processed') ||
            element.querySelector('svg') ||
            element.tagName === 'svg' ||
            element.tagName === 'SVG') {
            return false;
        }

        // Skip if the element's innerHTML already contains SVG
        if (element.innerHTML && element.innerHTML.trim().includes('<svg')) {
            return false;
        }

        // Skip if element has children that are SVG elements
        const svgChildren = element.querySelectorAll('svg');
        if (svgChildren.length > 0) {
            return false;
        }

        // Check for the data attribute
        return element.hasAttribute(this.config.attributeName) && 
               element.getAttribute(this.config.attributeName).trim().length > 0;
    }

    /**
     * Validate configuration
     * @private
     */
    _validateConfig() {
        if (!this.config.scope && typeof document !== 'undefined') {
            this.config.scope = document.body;
        }

        if (this.config.debounceDelay < 0) {
            this.config.debounceDelay = 0;
        }

        if (!this.config.attributeName || typeof this.config.attributeName !== 'string') {
            this.config.attributeName = 'data-sva-icon';
        }
    }

    /**
     * Log message if logging is enabled
     * @private
     * @param {string} message - Log message
     * @param {any} data - Additional data to log
     */
    _log(message, data = null) {
        if (this.config.enableLogging) {
            if (data) {
                console.log(`[SVA Icons Observer] ${message}`, data);
            } else {
                console.log(`[SVA Icons Observer] ${message}`);
            }
        }
    }

    /**
     * Log error and trigger error callback
     * @private
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    _error(message, error = null) {
        const fullMessage = error ? `${message} ${error.message}` : message;
        
        if (this.config.enableLogging) {
            console.error(`[SVA Icons Observer] ${fullMessage}`, error);
        }

        if (this.config.onError) {
            this.config.onError(new Error(fullMessage), error);
        }
    }
}

/**
 * Create and start a new mutation observer with default configuration
 * @param {ObserverConfig} config - Observer configuration
 * @returns {IconMutationObserver} The created observer instance
 */
export function createObserver(config = {}) {
    const observer = new IconMutationObserver(config);
    observer.start();
    return observer;
}

/**
 * Global observer instance for auto-initialization
 * @type {IconMutationObserver|null}
 */
let globalObserver = null;

/**
 * Initialize global mutation observer
 * @param {ObserverConfig} config - Observer configuration
 * @returns {boolean} True if initialized successfully
 */
export function initializeObserver(config = {}) {
    if (globalObserver) {
        globalObserver.stop();
    }

    globalObserver = new IconMutationObserver(config);
    return globalObserver.start();
}

/**
 * Stop global mutation observer
 * @returns {boolean} True if stopped successfully
 */
export function stopObserver() {
    if (globalObserver) {
        const success = globalObserver.stop();
        globalObserver = null;
        return success;
    }
    return true;
}

/**
 * Get global observer instance
 * @returns {IconMutationObserver|null} The global observer or null
 */
export function getObserver() {
    return globalObserver;
}

/**
 * Check if MutationObserver is supported
 * @returns {boolean} True if supported
 */
export function isObserverSupported() {
    return typeof window !== 'undefined' && 'MutationObserver' in window;
}

// Export default
export default IconMutationObserver;
