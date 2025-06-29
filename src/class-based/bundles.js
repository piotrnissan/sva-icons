/**
 * SVA Icons Bundle Integration Module
 * Provides bundle management, discovery, loading, and tree-shaking support
 * for the class-based icon system.
 */

/**
 * Bundle configuration with default values
 */
const BUNDLE_CONFIG = {
  enableLazyLoading: true,     // Whether to enable lazy bundle loading
  enableBundleCaching: true,   // Whether to cache loaded bundles
  bundleTimeout: 10000,        // Timeout for bundle loading (ms)
  preloadPriority: ['core', 'common'], // Bundles to preload
  bundleRetries: 3,            // Number of retry attempts for failed loads
  enableTreeShaking: true,     // Whether to enable tree shaking
  bundleBasePath: './bundles/', // Base path for bundle files
  enableBundleStats: true      // Whether to collect bundle statistics
};

/**
 * Bundle registry for tracking available and loaded bundles
 */
class BundleRegistry {
  constructor() {
    this.availableBundles = new Map();
    this.loadedBundles = new Map();
    this.loadingPromises = new Map();
    this.bundleMetadata = new Map();
    this.dependencies = new Map();
    this.stats = {
      totalBundles: 0,
      loadedBundles: 0,
      failedBundles: 0,
      totalLoadTime: 0,
      bundleSizes: new Map()
    };
  }

  /**
   * Register a bundle with the registry
   * @param {string} bundleName - Name of the bundle
   * @param {object} metadata - Bundle metadata
   */
  registerBundle(bundleName, metadata = {}) {
    this.availableBundles.set(bundleName, {
      name: bundleName,
      loaded: false,
      path: metadata.path || `${BUNDLE_CONFIG.bundleBasePath}${bundleName}.js`,
      icons: metadata.icons || [],
      dependencies: metadata.dependencies || [],
      size: metadata.size || 0,
      priority: metadata.priority || 'normal',
      description: metadata.description || '',
      version: metadata.version || '1.0.0',
      registeredAt: Date.now()
    });

    // Register dependencies
    if (metadata.dependencies && metadata.dependencies.length > 0) {
      this.dependencies.set(bundleName, metadata.dependencies);
    }

    this.stats.totalBundles++;
    
    console.log(`Bundle registered: ${bundleName}`, metadata);
  }

  /**
   * Get bundle information
   * @param {string} bundleName - Name of the bundle
   * @returns {object|null} Bundle information or null if not found
   */
  getBundleInfo(bundleName) {
    return this.availableBundles.get(bundleName) || null;
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
   * Mark bundle as loaded
   * @param {string} bundleName - Name of the bundle
   * @param {object} bundleModule - Loaded bundle module
   */
  markBundleLoaded(bundleName, bundleModule) {
    this.loadedBundles.set(bundleName, {
      module: bundleModule,
      loadedAt: Date.now(),
      icons: bundleModule.icons || [],
      exports: Object.keys(bundleModule)
    });

    const bundleInfo = this.availableBundles.get(bundleName);
    if (bundleInfo) {
      bundleInfo.loaded = true;
    }

    this.stats.loadedBundles++;
  }

  /**
   * Get all available bundle names
   * @returns {Array<string>} Array of bundle names
   */
  getAvailableBundles() {
    return Array.from(this.availableBundles.keys());
  }

  /**
   * Get all loaded bundle names
   * @returns {Array<string>} Array of loaded bundle names
   */
  getLoadedBundles() {
    return Array.from(this.loadedBundles.keys());
  }

  /**
   * Get bundle dependencies
   * @param {string} bundleName - Name of the bundle
   * @returns {Array<string>} Array of dependency bundle names
   */
  getBundleDependencies(bundleName) {
    return this.dependencies.get(bundleName) || [];
  }

  /**
   * Get bundle statistics
   * @returns {object} Bundle statistics
   */
  getStats() {
    return {
      ...this.stats,
      availableBundles: this.availableBundles.size,
      loadSuccessRate: this.stats.totalBundles > 0 
        ? ((this.stats.loadedBundles / this.stats.totalBundles) * 100).toFixed(1) + '%'
        : '0%',
      averageLoadTime: this.stats.loadedBundles > 0
        ? (this.stats.totalLoadTime / this.stats.loadedBundles).toFixed(2) + 'ms'
        : '0ms'
    };
  }

  /**
   * Clear all registry data (for testing)
   */
  clear() {
    this.availableBundles.clear();
    this.loadedBundles.clear();
    this.loadingPromises.clear();
    this.bundleMetadata.clear();
    this.dependencies.clear();
    this.stats = {
      totalBundles: 0,
      loadedBundles: 0,
      failedBundles: 0,
      totalLoadTime: 0,
      bundleSizes: new Map()
    };
  }
}

/**
 * Bundle loader with dependency resolution and caching
 */
class BundleLoader {
  constructor(registry, config = {}) {
    this.registry = registry;
    this.config = { ...BUNDLE_CONFIG, ...config };
    this.loadQueue = [];
    this.processing = false;
  }

  /**
   * Load a bundle with dependencies
   * @param {string} bundleName - Name of the bundle to load
   * @param {object} options - Loading options
   * @returns {Promise} Promise that resolves when bundle is loaded
   */
  async loadBundle(bundleName, options = {}) {
    // Check if already loaded
    if (this.registry.isBundleLoaded(bundleName)) {
      return this.registry.loadedBundles.get(bundleName);
    }

    // Check if already loading
    if (this.registry.loadingPromises.has(bundleName)) {
      return this.registry.loadingPromises.get(bundleName);
    }

    // Create loading promise
    const loadPromise = this.loadBundleInternal(bundleName, options);
    this.registry.loadingPromises.set(bundleName, loadPromise);

    try {
      const result = await loadPromise;
      this.registry.loadingPromises.delete(bundleName);
      return result;
    } catch (error) {
      this.registry.loadingPromises.delete(bundleName);
      this.registry.stats.failedBundles++;
      throw error;
    }
  }

  /**
   * Internal bundle loading logic with dependency resolution
   * @param {string} bundleName - Name of the bundle to load
   * @param {object} options - Loading options
   * @returns {Promise} Promise that resolves when bundle is loaded
   */
  async loadBundleInternal(bundleName, options = {}) {
    const startTime = performance.now();
    
    try {
      // Load dependencies first
      const dependencies = this.registry.getBundleDependencies(bundleName);
      if (dependencies.length > 0) {
        console.log(`Loading dependencies for ${bundleName}:`, dependencies);
        await Promise.all(dependencies.map(dep => this.loadBundle(dep, options)));
      }

      // Get bundle info
      const bundleInfo = this.registry.getBundleInfo(bundleName);
      if (!bundleInfo) {
        throw new Error(`Bundle "${bundleName}" not found in registry`);
      }

      // Dynamic import with timeout
      const bundleModule = await this.loadWithTimeout(bundleInfo.path, this.config.bundleTimeout);
      
      // Register icons if the bundle provides them
      if (bundleModule.registerIcons && typeof bundleModule.registerIcons === 'function') {
        bundleModule.registerIcons();
      }

      // Mark as loaded
      this.registry.markBundleLoaded(bundleName, bundleModule);
      
      const loadTime = performance.now() - startTime;
      this.registry.stats.totalLoadTime += loadTime;

      console.log(`Bundle "${bundleName}" loaded successfully in ${loadTime.toFixed(2)}ms`);
      
      return {
        module: bundleModule,
        loadTime,
        bundleName
      };

    } catch (error) {
      console.error(`Failed to load bundle "${bundleName}":`, error);
      
      // Retry logic
      if (options.retryCount < this.config.bundleRetries) {
        console.log(`Retrying bundle load: ${bundleName} (attempt ${options.retryCount + 1})`);
        return this.loadBundleInternal(bundleName, { 
          ...options, 
          retryCount: (options.retryCount || 0) + 1 
        });
      }
      
      throw new Error(`Bundle "${bundleName}" failed to load after ${this.config.bundleRetries} attempts: ${error.message}`);
    }
  }

  /**
   * Load bundle with timeout
   * @param {string} bundlePath - Path to the bundle
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} Promise that resolves with bundle module
   */
  async loadWithTimeout(bundlePath, timeout) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Bundle load timeout: ${bundlePath}`));
      }, timeout);

      import(bundlePath)
        .then(module => {
          clearTimeout(timeoutId);
          resolve(module);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Preload priority bundles
   * @returns {Promise} Promise that resolves when priority bundles are loaded
   */
  async preloadPriorityBundles() {
    if (!this.config.enableLazyLoading || this.config.preloadPriority.length === 0) {
      return;
    }

    console.log('Preloading priority bundles:', this.config.preloadPriority);
    
    const preloadPromises = this.config.preloadPriority.map(bundleName => {
      return this.loadBundle(bundleName).catch(error => {
        console.warn(`Failed to preload priority bundle "${bundleName}":`, error);
        return null; // Don't fail the entire preload if one bundle fails
      });
    });

    await Promise.allSettled(preloadPromises);
    console.log('Priority bundle preloading completed');
  }

  /**
   * Load multiple bundles in parallel
   * @param {Array<string>} bundleNames - Array of bundle names to load
   * @param {object} options - Loading options
   * @returns {Promise} Promise that resolves when all bundles are loaded
   */
  async loadBundles(bundleNames, options = {}) {
    const loadPromises = bundleNames.map(bundleName => 
      this.loadBundle(bundleName, options).catch(error => {
        console.error(`Failed to load bundle "${bundleName}":`, error);
        return { error, bundleName };
      })
    );

    const results = await Promise.allSettled(loadPromises);
    
    return {
      successful: results.filter(r => r.status === 'fulfilled' && !r.value.error).map(r => r.value),
      failed: results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error)).map(r => r.reason || r.value)
    };
  }
}

/**
 * Icon discovery service for finding icons across bundles
 */
class IconDiscovery {
  constructor(registry) {
    this.registry = registry;
    this.iconIndex = new Map(); // icon name -> bundle name mapping
    this.reverseIndex = new Map(); // bundle name -> icon names mapping
  }

  /**
   * Build icon index from registered bundles
   */
  buildIconIndex() {
    this.iconIndex.clear();
    this.reverseIndex.clear();

    for (const [bundleName, bundleInfo] of this.registry.availableBundles) {
      const icons = bundleInfo.icons || [];
      this.reverseIndex.set(bundleName, icons);
      
      icons.forEach(iconName => {
        // Handle potential conflicts - last bundle wins
        if (this.iconIndex.has(iconName)) {
          console.warn(`Icon "${iconName}" found in multiple bundles. Using bundle: ${bundleName}`);
        }
        this.iconIndex.set(iconName, bundleName);
      });
    }

    console.log(`Icon index built: ${this.iconIndex.size} icons across ${this.registry.availableBundles.size} bundles`);
  }

  /**
   * Find which bundle contains an icon
   * @param {string} iconName - Name of the icon
   * @returns {string|null} Bundle name or null if not found
   */
  findBundleForIcon(iconName) {
    return this.iconIndex.get(iconName) || null;
  }

  /**
   * Get all icons in a bundle
   * @param {string} bundleName - Name of the bundle
   * @returns {Array<string>} Array of icon names
   */
  getIconsInBundle(bundleName) {
    return this.reverseIndex.get(bundleName) || [];
  }

  /**
   * Search for icons by pattern
   * @param {string} pattern - Search pattern (regex or string)
   * @param {boolean} isRegex - Whether pattern is a regex
   * @returns {Array<object>} Array of matching icons with bundle info
   */
  searchIcons(pattern, isRegex = false) {
    const regex = isRegex ? new RegExp(pattern, 'i') : new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const matches = [];

    for (const [iconName, bundleName] of this.iconIndex) {
      if (regex.test(iconName)) {
        matches.push({
          iconName,
          bundleName,
          bundleInfo: this.registry.getBundleInfo(bundleName)
        });
      }
    }

    return matches;
  }

  /**
   * Get bundle usage statistics
   * @returns {object} Bundle usage statistics
   */
  getBundleUsageStats() {
    const stats = {
      totalIcons: this.iconIndex.size,
      bundleDistribution: {},
      averageIconsPerBundle: 0,
      largestBundle: { name: '', iconCount: 0 },
      smallestBundle: { name: '', iconCount: Infinity }
    };

    for (const [bundleName, icons] of this.reverseIndex) {
      const iconCount = icons.length;
      stats.bundleDistribution[bundleName] = iconCount;

      if (iconCount > stats.largestBundle.iconCount) {
        stats.largestBundle = { name: bundleName, iconCount };
      }

      if (iconCount < stats.smallestBundle.iconCount) {
        stats.smallestBundle = { name: bundleName, iconCount };
      }
    }

    stats.averageIconsPerBundle = this.reverseIndex.size > 0 
      ? (this.iconIndex.size / this.reverseIndex.size).toFixed(1)
      : 0;

    return stats;
  }
}

/**
 * Tree shaking analyzer for optimizing bundle loading
 */
class TreeShakingAnalyzer {
  constructor() {
    this.usageStats = new Map(); // icon name -> usage count
    this.bundleUsage = new Map(); // bundle name -> usage count
    this.unusedIcons = new Set();
    this.criticalIcons = new Set();
  }

  /**
   * Record icon usage
   * @param {string} iconName - Name of the used icon
   * @param {string} bundleName - Bundle containing the icon
   */
  recordIconUsage(iconName, bundleName) {
    // Update icon usage
    const currentUsage = this.usageStats.get(iconName) || 0;
    this.usageStats.set(iconName, currentUsage + 1);

    // Update bundle usage
    const currentBundleUsage = this.bundleUsage.get(bundleName) || 0;
    this.bundleUsage.set(bundleName, currentBundleUsage + 1);

    // Mark as critical if used frequently
    if (currentUsage + 1 >= 5) {
      this.criticalIcons.add(iconName);
    }

    // Remove from unused set if it was there
    this.unusedIcons.delete(iconName);
  }

  /**
   * Analyze bundle usage and provide optimization suggestions
   * @param {IconDiscovery} iconDiscovery - Icon discovery service
   * @returns {object} Analysis results with optimization suggestions
   */
  analyzeUsage(iconDiscovery) {
    const bundleStats = iconDiscovery.getBundleUsageStats();
    const recommendations = {
      unusedBundles: [],
      underutilizedBundles: [],
      criticalBundles: [],
      suggestedPreload: [],
      suggestedLazyLoad: []
    };

    // Analyze each bundle
    for (const [bundleName, iconCount] of Object.entries(bundleStats.bundleDistribution)) {
      const bundleUsage = this.bundleUsage.get(bundleName) || 0;
      const usageRatio = iconCount > 0 ? (bundleUsage / iconCount) : 0;

      if (bundleUsage === 0) {
        recommendations.unusedBundles.push(bundleName);
      } else if (usageRatio < 0.2) {
        recommendations.underutilizedBundles.push({
          bundleName,
          usageRatio: (usageRatio * 100).toFixed(1) + '%',
          totalIcons: iconCount,
          usedIcons: bundleUsage
        });
      } else if (usageRatio > 0.7) {
        recommendations.criticalBundles.push({
          bundleName,
          usageRatio: (usageRatio * 100).toFixed(1) + '%',
          totalIcons: iconCount,
          usedIcons: bundleUsage
        });
      }
    }

    // Suggest preloading for critical bundles
    recommendations.suggestedPreload = recommendations.criticalBundles.map(b => b.bundleName);

    // Suggest lazy loading for underutilized bundles
    recommendations.suggestedLazyLoad = recommendations.underutilizedBundles.map(b => b.bundleName);

    return {
      totalIconsTracked: this.usageStats.size,
      totalBundlesTracked: this.bundleUsage.size,
      criticalIcons: Array.from(this.criticalIcons),
      unusedIcons: Array.from(this.unusedIcons),
      recommendations,
      usageStats: Object.fromEntries(this.usageStats),
      bundleUsageStats: Object.fromEntries(this.bundleUsage)
    };
  }

  /**
   * Get tree shaking report
   * @returns {object} Tree shaking analysis report
   */
  getTreeShakingReport() {
    const totalIcons = this.usageStats.size;
    const usedIcons = Array.from(this.usageStats.keys()).filter(icon => this.usageStats.get(icon) > 0);
    const criticalIconsCount = this.criticalIcons.size;

    return {
      summary: {
        totalTrackedIcons: totalIcons,
        usedIcons: usedIcons.length,
        unusedIcons: totalIcons - usedIcons.length,
        criticalIcons: criticalIconsCount,
        utilizationRate: totalIcons > 0 ? ((usedIcons.length / totalIcons) * 100).toFixed(1) + '%' : '0%'
      },
      details: {
        mostUsedIcons: this.getMostUsedIcons(10),
        leastUsedIcons: this.getLeastUsedIcons(10),
        criticalIcons: Array.from(this.criticalIcons)
      }
    };
  }

  /**
   * Get most used icons
   * @param {number} count - Number of icons to return
   * @returns {Array<object>} Array of most used icons
   */
  getMostUsedIcons(count = 10) {
    return Array.from(this.usageStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([iconName, usageCount]) => ({ iconName, usageCount }));
  }

  /**
   * Get least used icons
   * @param {number} count - Number of icons to return
   * @returns {Array<object>} Array of least used icons
   */
  getLeastUsedIcons(count = 10) {
    return Array.from(this.usageStats.entries())
      .filter(([, usageCount]) => usageCount > 0)
      .sort((a, b) => a[1] - b[1])
      .slice(0, count)
      .map(([iconName, usageCount]) => ({ iconName, usageCount }));
  }

  /**
   * Reset all tracking data
   */
  reset() {
    this.usageStats.clear();
    this.bundleUsage.clear();
    this.unusedIcons.clear();
    this.criticalIcons.clear();
  }
}

/**
 * Main bundle manager class
 */
class BundleManager {
  constructor(config = {}) {
    this.config = { ...BUNDLE_CONFIG, ...config };
    this.registry = new BundleRegistry();
    this.loader = new BundleLoader(this.registry, this.config);
    this.discovery = new IconDiscovery(this.registry);
    this.treeShaking = new TreeShakingAnalyzer();
    this.initialized = false;
  }

  /**
   * Initialize the bundle manager
   * @param {object} config - Configuration options
   */
  async initialize(config = {}) {
    if (this.initialized) return;

    this.config = { ...this.config, ...config };
    
    // Auto-discover bundles if available
    await this.discoverBundles();
    
    // Build icon index
    this.discovery.buildIconIndex();
    
    // Preload priority bundles
    if (this.config.enableLazyLoading) {
      await this.loader.preloadPriorityBundles();
    }
    
    this.initialized = true;
    console.log('Bundle manager initialized', this.getManagerStats());
  }

  /**
   * Auto-discover available bundles
   */
  async discoverBundles() {
    // This would typically read from a bundle manifest or scan a directory
    // For now, we'll register some common bundles
    const commonBundles = [
      {
        name: 'core',
        icons: ['alert', 'check', 'error', 'info', 'warning'],
        priority: 'high',
        description: 'Core system icons'
      },
      {
        name: 'navigation',
        icons: ['arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'menu', 'close'],
        dependencies: ['core'],
        description: 'Navigation and directional icons'
      },
      {
        name: 'automotive',
        icons: ['car', 'battery', 'engine', 'fuel', 'gear', 'speedometer'],
        description: 'Automotive-specific icons'
      },
      {
        name: 'ui',
        icons: ['button', 'input', 'select', 'toggle', 'slider', 'progress'],
        dependencies: ['core'],
        description: 'User interface components'
      }
    ];

    commonBundles.forEach(bundle => {
      this.registry.registerBundle(bundle.name, bundle);
    });
  }

  /**
   * Process icon with bundle integration
   * @param {string} iconName - Name of the icon
   * @param {object} options - Processing options
   * @returns {Promise} Promise that resolves when icon bundle is loaded
   */
  async processIconWithBundle(iconName, options = {}) {
    // Find which bundle contains the icon
    const bundleName = this.discovery.findBundleForIcon(iconName);
    
    if (!bundleName) {
      throw new Error(`Icon "${iconName}" not found in any registered bundle`);
    }

    // Load the bundle if not already loaded
    if (!this.registry.isBundleLoaded(bundleName)) {
      await this.loader.loadBundle(bundleName, options);
    }

    // Record usage for tree shaking
    if (this.config.enableTreeShaking) {
      this.treeShaking.recordIconUsage(iconName, bundleName);
    }

    return {
      iconName,
      bundleName,
      bundleLoaded: true
    };
  }

  /**
   * Get comprehensive bundle manager statistics
   * @returns {object} Bundle manager statistics
   */
  getManagerStats() {
    return {
      config: this.config,
      registry: this.registry.getStats(),
      discovery: this.discovery.getBundleUsageStats(),
      treeShaking: this.treeShaking.getTreeShakingReport(),
      initialized: this.initialized
    };
  }

  /**
   * Get optimization recommendations
   * @returns {object} Optimization recommendations
   */
  getOptimizationRecommendations() {
    const analysis = this.treeShaking.analyzeUsage(this.discovery);
    const registryStats = this.registry.getStats();

    return {
      bundleOptimization: analysis.recommendations,
      performanceRecommendations: {
        enableLazyLoading: !this.config.enableLazyLoading && registryStats.availableBundles > 3,
        increasePreloadList: analysis.recommendations.criticalBundles.length > this.config.preloadPriority.length,
        reduceBundleSize: analysis.recommendations.underutilizedBundles.length > 0
      },
      treeShaking: analysis,
      summary: `${analysis.recommendations.criticalBundles.length} critical, ${analysis.recommendations.unusedBundles.length} unused, ${analysis.recommendations.underutilizedBundles.length} underutilized bundles`
    };
  }

  /**
   * Reset all bundle manager data
   */
  reset() {
    this.registry.clear();
    this.discovery.iconIndex.clear();
    this.discovery.reverseIndex.clear();
    this.treeShaking.reset();
    this.initialized = false;
  }
}

// Export classes and default instance
export {
  BundleManager,
  BundleRegistry,
  BundleLoader,
  IconDiscovery,
  TreeShakingAnalyzer,
  BUNDLE_CONFIG
};

// Create and export default instance
export const bundleManager = new BundleManager();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined' && window.document) {
  // Make bundle manager globally available
  window.svaIconsBundles = bundleManager;
  
  // Initialize on DOM ready or immediately if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bundleManager.initialize().catch(console.error);
    });
  } else {
    bundleManager.initialize().catch(console.error);
  }
}
