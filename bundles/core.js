/**
 * SVA Icons Core Bundle
 * Contains essential icons used throughout the application
 */

const CORE_ICONS = {
  'check': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`,
  'close': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  'home': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  'search': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
  'menu': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`,
  'arrow-down': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>`,
  'arrow-up': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>`,
  'arrow-left': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>`,
  'arrow-right': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>`
};

// Bundle metadata
const CORE_BUNDLE_METADATA = {
  name: 'core',
  version: '1.0.0',
  description: 'Essential icons for all applications',
  icons: Object.keys(CORE_ICONS),
  size: JSON.stringify(CORE_ICONS).length,
  dependencies: [],
  tags: ['essential', 'navigation', 'ui']
};

// Export for bundle system
if (typeof window !== 'undefined' && window.SvaIcons && window.SvaIcons.bundleRegistry) {
  window.SvaIcons.bundleRegistry.registerBundle('core', {
    icons: CORE_ICONS,
    metadata: CORE_BUNDLE_METADATA
  });
}

// Module export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    icons: CORE_ICONS,
    metadata: CORE_BUNDLE_METADATA
  };
}
