/**
 * SVA Icons Performance Optimization Module
 * Provides batch processing, caching, lazy loading, and performance monitoring
 * for the class-based icon system.
 */

/**
 * Performance configuration with default values
 */
const PERFORMANCE_CONFIG = {
  batchSize: 50,           // Maximum icons to process in a single batch
  batchDelay: 16,          // Delay between batches (ms) - ~60fps
  cacheSize: 500,          // Maximum number of cached SVG strings
  debounceDelay: 10,       // Debounce delay for performance monitoring
  enableMetrics: true,     // Whether to collect performance metrics
  enableCache: true,       // Whether to enable SVG caching
  enableBatching: true,    // Whether to enable batch processing
  enableLazyLoading: false // Whether to enable lazy loading (off by default)
};

/**
 * SVG cache for preventing duplicate processing
 */
class SVGCache {
  constructor(maxSize = PERFORMANCE_CONFIG.cacheSize) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cached SVG content
   * @param {string} iconName - Name of the icon
   * @returns {string|null} Cached SVG content or null if not found
   */
  get(iconName) {
    if (this.cache.has(iconName)) {
      this.hits++;
      // Move to end (LRU)
      const value = this.cache.get(iconName);
      this.cache.delete(iconName);
      this.cache.set(iconName, value);
      return value;
    }
    this.misses++;
    return null;
  }

  /**
   * Set cached SVG content
   * @param {string} iconName - Name of the icon
   * @param {string} svgContent - SVG content to cache
   */
  set(iconName, svgContent) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(iconName, svgContent);
  }

  /**
   * Clear the cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%'
    };
  }
}

/**
 * Performance metrics collector
 */
class PerformanceMetrics {
  constructor() {
    this.metrics = {
      totalIcons: 0,
      totalProcessingTime: 0,
      batchCount: 0,
      averageIconTime: 0,
      peakBatchTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0
    };
    this.timings = [];
    this.maxTimings = 100; // Keep last 100 timings
  }

  /**
   * Record icon processing time
   * @param {number} duration - Processing duration in milliseconds
   */
  recordIconTime(duration) {
    this.metrics.totalIcons++;
    this.metrics.totalProcessingTime += duration;
    this.metrics.averageIconTime = this.metrics.totalProcessingTime / this.metrics.totalIcons;
    
    this.timings.push(duration);
    if (this.timings.length > this.maxTimings) {
      this.timings.shift();
    }
  }

  /**
   * Record batch processing time
   * @param {number} duration - Batch processing duration in milliseconds
   * @param {number} iconCount - Number of icons in the batch
   */
  recordBatchTime(duration, iconCount) {
    this.metrics.batchCount++;
    if (duration > this.metrics.peakBatchTime) {
      this.metrics.peakBatchTime = duration;
    }
  }

  /**
   * Update cache statistics
   * @param {object} cacheStats - Cache statistics from SVGCache
   */
  updateCacheStats(cacheStats) {
    this.metrics.cacheHitRate = cacheStats.hitRate;
  }

  /**
   * Get current metrics
   * @returns {object} Current performance metrics
   */
  getMetrics() {
    // Calculate memory usage estimate
    this.metrics.memoryUsage = this.estimateMemoryUsage();
    
    return {
      ...this.metrics,
      recentTimings: [...this.timings],
      timestamp: Date.now()
    };
  }

  /**
   * Estimate memory usage (rough calculation)
   * @returns {number} Estimated memory usage in KB
   */
  estimateMemoryUsage() {
    // Rough estimate: each timing entry ~8 bytes, plus overhead
    const timingsMemory = this.timings.length * 8;
    const metricsMemory = Object.keys(this.metrics).length * 8;
    return Math.round((timingsMemory + metricsMemory) / 1024 * 100) / 100;
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      totalIcons: 0,
      totalProcessingTime: 0,
      batchCount: 0,
      averageIconTime: 0,
      peakBatchTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0
    };
    this.timings = [];
  }
}

/**
 * Batch processor for handling multiple icons efficiently
 */
class BatchProcessor {
  constructor(config = {}) {
    this.config = { ...PERFORMANCE_CONFIG, ...config };
    this.queue = [];
    this.processing = false;
    this.timeoutId = null;
  }

  /**
   * Add icon to processing queue
   * @param {HTMLElement} element - Element to process
   * @param {string} iconName - Name of the icon
   * @param {object} options - Processing options
   * @returns {Promise} Promise that resolves when icon is processed
   */
  add(element, iconName, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        element,
        iconName,
        options,
        resolve,
        reject,
        timestamp: performance.now()
      });

      this.scheduleProcessing();
    });
  }

  /**
   * Schedule batch processing
   */
  scheduleProcessing() {
    if (this.processing) return;

    // Clear existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Schedule processing
    this.timeoutId = setTimeout(() => {
      this.processQueue();
    }, this.config.batchDelay);
  }

  /**
   * Process the current queue
   */
  async processQueue() {
    if (this.queue.length === 0 || this.processing) return;

    this.processing = true;
    const startTime = performance.now();

    try {
      // Process queue in batches
      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.config.batchSize);
        await this.processBatch(batch);

        // Yield control to browser between batches
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.batchDelay));
        }
      }
    } catch (error) {
      console.error('Batch processing error:', error);
      // Reject remaining items in queue
      this.queue.forEach(item => item.reject(error));
      this.queue = [];
    } finally {
      this.processing = false;
      const duration = performance.now() - startTime;
      
      // Record batch performance if metrics are enabled
      if (this.config.enableMetrics && window.svaIconsPerformance) {
        window.svaIconsPerformance.metrics.recordBatchTime(duration, this.queue.length + this.config.batchSize);
      }
    }
  }

  /**
   * Process a single batch of icons
   * @param {Array} batch - Batch of icon processing requests
   */
  async processBatch(batch) {
    const promises = batch.map(async (item) => {
      const startTime = performance.now();
      
      try {
        // Import required modules dynamically to avoid circular dependencies
        const { resolveIconName } = await import('./resolver.js');
        const { injectSVG } = await import('./injector.js');

        // Resolve icon name
        const resolvedName = resolveIconName(item.iconName);
        
        // Check cache first
        let svgContent = null;
        if (this.config.enableCache && window.svaIconsPerformance?.cache) {
          svgContent = window.svaIconsPerformance.cache.get(resolvedName);
        }

        // Load icon if not cached
        if (!svgContent) {
          // Dynamic import of icon function
          const iconModule = await import(`../icons-browser.js`);
          const iconFunction = iconModule[resolvedName];
          
          if (!iconFunction) {
            throw new Error(`Icon "${resolvedName}" not found`);
          }

          svgContent = iconFunction(item.options);
          
          // Cache the result
          if (this.config.enableCache && window.svaIconsPerformance?.cache) {
            window.svaIconsPerformance.cache.set(resolvedName, svgContent);
          }
        }

        // Inject SVG
        await injectSVG(item.element, svgContent, item.options);
        
        const duration = performance.now() - startTime;
        
        // Record performance metrics
        if (this.config.enableMetrics && window.svaIconsPerformance?.metrics) {
          window.svaIconsPerformance.metrics.recordIconTime(duration);
        }

        item.resolve();
      } catch (error) {
        console.error(`Error processing icon "${item.iconName}":`, error);
        item.reject(error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Clear the processing queue
   */
  clearQueue() {
    this.queue.forEach(item => item.reject(new Error('Queue cleared')));
    this.queue = [];
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Get queue statistics
   * @returns {object} Queue statistics
   */
  getStats() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      batchSize: this.config.batchSize,
      batchDelay: this.config.batchDelay
    };
  }
}

/**
 * Lazy loading manager for icon bundles
 */
class LazyLoader {
  constructor() {
    this.loadedBundles = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * Load icon bundle on demand
   * @param {string} bundleName - Name of the bundle to load
   * @returns {Promise} Promise that resolves when bundle is loaded
   */
  async loadBundle(bundleName) {
    if (this.loadedBundles.has(bundleName)) {
      return true; // Already loaded
    }

    if (this.loadingPromises.has(bundleName)) {
      return this.loadingPromises.get(bundleName); // Already loading
    }

    const loadPromise = this.loadBundleInternal(bundleName);
    this.loadingPromises.set(bundleName, loadPromise);

    try {
      await loadPromise;
      this.loadedBundles.add(bundleName);
      this.loadingPromises.delete(bundleName);
      return true;
    } catch (error) {
      this.loadingPromises.delete(bundleName);
      throw error;
    }
  }

  /**
   * Internal bundle loading logic
   * @param {string} bundleName - Name of the bundle to load
   * @returns {Promise} Promise that resolves when bundle is loaded
   */
  async loadBundleInternal(bundleName) {
    try {
      // Dynamic import of the bundle
      const bundleModule = await import(`../bundles/${bundleName}.js`);
      
      // Register icons from the bundle if needed
      if (bundleModule.registerIcons && typeof bundleModule.registerIcons === 'function') {
        bundleModule.registerIcons();
      }

      return true;
    } catch (error) {
      console.error(`Failed to load bundle "${bundleName}":`, error);
      throw new Error(`Bundle "${bundleName}" could not be loaded`);
    }
  }

  /**
   * Check if bundle is loaded
   * @param {string} bundleName - Name of the bundle
   * @returns {boolean} True if bundle is loaded
   */
  isBundleLoaded(bundleName) {
    return this.loadedBundles.has(bundleName);
  }

  /**
   * Get loaded bundle names
   * @returns {Array<string>} Array of loaded bundle names
   */
  getLoadedBundles() {
    return Array.from(this.loadedBundles);
  }

  /**
   * Clear all loaded bundles (for testing)
   */
  clearLoadedBundles() {
    this.loadedBundles.clear();
    this.loadingPromises.clear();
  }
}

/**
 * Main performance optimization manager
 */
class PerformanceManager {
  constructor(config = {}) {
    this.config = { ...PERFORMANCE_CONFIG, ...config };
    this.cache = new SVGCache(this.config.cacheSize);
    this.metrics = new PerformanceMetrics();
    this.batchProcessor = new BatchProcessor(this.config);
    this.lazyLoader = new LazyLoader();
    this.initialized = false;
  }

  /**
   * Initialize the performance manager
   * @param {object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.initialized) return;

    this.config = { ...this.config, ...config };
    
    // Update batch processor config
    this.batchProcessor.config = { ...this.batchProcessor.config, ...this.config };
    
    // Make performance manager globally available
    if (typeof window !== 'undefined') {
      window.svaIconsPerformance = this;
    }

    this.initialized = true;
    
    console.log('SVA Icons Performance Manager initialized', {
      caching: this.config.enableCache,
      batching: this.config.enableBatching,
      metrics: this.config.enableMetrics,
      lazyLoading: this.config.enableLazyLoading
    });
  }

  /**
   * Process icon with performance optimizations
   * @param {HTMLElement} element - Element to process
   * @param {string} iconName - Name of the icon
   * @param {object} options - Processing options
   * @returns {Promise} Promise that resolves when icon is processed
   */
  async processIcon(element, iconName, options = {}) {
    if (!this.initialized) {
      this.initialize();
    }

    // Use batch processing if enabled
    if (this.config.enableBatching) {
      return this.batchProcessor.add(element, iconName, options);
    }

    // Process immediately without batching
    const startTime = performance.now();
    
    try {
      const { resolveIconName } = await import('./resolver.js');
      const { injectSVG } = await import('./injector.js');

      const resolvedName = resolveIconName(iconName);
      
      // Check cache
      let svgContent = null;
      if (this.config.enableCache) {
        svgContent = this.cache.get(resolvedName);
      }

      // Load icon if not cached
      if (!svgContent) {
        // Load bundle if lazy loading is enabled
        if (this.config.enableLazyLoading && options.bundle) {
          await this.lazyLoader.loadBundle(options.bundle);
        }

        const iconModule = await import(`../icons-browser.js`);
        const iconFunction = iconModule[resolvedName];
        
        if (!iconFunction) {
          throw new Error(`Icon "${resolvedName}" not found`);
        }

        svgContent = iconFunction(options);
        
        if (this.config.enableCache) {
          this.cache.set(resolvedName, svgContent);
        }
      }

      await injectSVG(element, svgContent, options);
      
      const duration = performance.now() - startTime;
      
      if (this.config.enableMetrics) {
        this.metrics.recordIconTime(duration);
        this.metrics.updateCacheStats(this.cache.getStats());
      }

    } catch (error) {
      console.error(`Error processing icon "${iconName}":`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive performance report
   * @returns {object} Performance report with all statistics
   */
  getPerformanceReport() {
    return {
      config: this.config,
      cache: this.cache.getStats(),
      metrics: this.metrics.getMetrics(),
      batchProcessor: this.batchProcessor.getStats(),
      lazyLoader: {
        loadedBundles: this.lazyLoader.getLoadedBundles(),
        bundleCount: this.lazyLoader.getLoadedBundles().length
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reset all performance data
   */
  reset() {
    this.cache.clear();
    this.metrics.reset();
    this.batchProcessor.clearQueue();
    this.lazyLoader.clearLoadedBundles();
  }

  /**
   * Optimize configuration based on current metrics
   * @returns {object} Suggested configuration optimizations
   */
  optimizeConfiguration() {
    const report = this.getPerformanceReport();
    const suggestions = {};

    // Suggest batch size optimization
    if (report.metrics.averageIconTime > 1 && report.batchProcessor.batchSize > 20) {
      suggestions.batchSize = Math.max(20, Math.floor(report.batchProcessor.batchSize * 0.8));
    } else if (report.metrics.averageIconTime < 0.5 && report.batchProcessor.batchSize < 100) {
      suggestions.batchSize = Math.min(100, Math.floor(report.batchProcessor.batchSize * 1.2));
    }

    // Suggest cache size optimization
    const cacheHitRate = parseFloat(report.cache.hitRate);
    if (cacheHitRate < 80 && this.cache.maxSize < 1000) {
      suggestions.cacheSize = Math.min(1000, this.cache.maxSize * 1.5);
    } else if (cacheHitRate > 95 && this.cache.maxSize > 100) {
      suggestions.cacheSize = Math.max(100, this.cache.maxSize * 0.8);
    }

    // Suggest enabling lazy loading if many bundles
    if (report.lazyLoader.bundleCount > 5 && !this.config.enableLazyLoading) {
      suggestions.enableLazyLoading = true;
    }

    return {
      current: this.config,
      suggestions,
      reasoning: this.generateOptimizationReasoning(report, suggestions)
    };
  }

  /**
   * Generate reasoning for optimization suggestions
   * @param {object} report - Performance report
   * @param {object} suggestions - Optimization suggestions
   * @returns {Array<string>} Array of reasoning messages
   */
  generateOptimizationReasoning(report, suggestions) {
    const reasoning = [];

    if (suggestions.batchSize) {
      if (suggestions.batchSize < this.config.batchSize) {
        reasoning.push(`Reducing batch size to improve responsiveness (current avg: ${report.metrics.averageIconTime.toFixed(2)}ms)`);
      } else {
        reasoning.push(`Increasing batch size to improve throughput (current avg: ${report.metrics.averageIconTime.toFixed(2)}ms)`);
      }
    }

    if (suggestions.cacheSize) {
      const hitRate = parseFloat(report.cache.hitRate);
      if (suggestions.cacheSize > this.cache.maxSize) {
        reasoning.push(`Increasing cache size to improve hit rate (current: ${hitRate.toFixed(1)}%)`);
      } else {
        reasoning.push(`Reducing cache size to save memory (current hit rate: ${hitRate.toFixed(1)}%)`);
      }
    }

    if (suggestions.enableLazyLoading) {
      reasoning.push(`Enabling lazy loading to reduce initial bundle size (${report.lazyLoader.bundleCount} bundles detected)`);
    }

    return reasoning;
  }
}

// Export the main classes and default instance
export {
  PerformanceManager,
  SVGCache,
  PerformanceMetrics,
  BatchProcessor,
  LazyLoader,
  PERFORMANCE_CONFIG
};

// Create and export default instance
export const performanceManager = new PerformanceManager();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined' && window.document) {
  // Initialize on DOM ready or immediately if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceManager.initialize();
    });
  } else {
    performanceManager.initialize();
  }
}
