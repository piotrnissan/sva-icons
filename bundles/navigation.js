/**
 * SVA Icons Navigation Bundle
 * Contains navigation-related icons
 */

const NAVIGATION_ICONS = {
  'back': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
  'forward': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>`,
  'first-page': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/></svg>`,
  'last-page': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/></svg>`,
  'chevron-left': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`,
  'chevron-right': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`,
  'expand-less': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>`,
  'expand-more': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>`,
  'fullscreen': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
  'fullscreen-exit': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`
};

// Bundle metadata
const NAVIGATION_BUNDLE_METADATA = {
  name: 'navigation',
  version: '1.0.0',
  description: 'Navigation and directional icons',
  icons: Object.keys(NAVIGATION_ICONS),
  size: JSON.stringify(NAVIGATION_ICONS).length,
  dependencies: [],
  tags: ['navigation', 'directional', 'ui']
};

// Export for bundle system
if (typeof window !== 'undefined' && window.SvaIcons && window.SvaIcons.bundleRegistry) {
  window.SvaIcons.bundleRegistry.registerBundle('navigation', {
    icons: NAVIGATION_ICONS,
    metadata: NAVIGATION_BUNDLE_METADATA
  });
}

// Module export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    icons: NAVIGATION_ICONS,
    metadata: NAVIGATION_BUNDLE_METADATA
  };
}
