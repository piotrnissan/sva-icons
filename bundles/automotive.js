/**
 * SVA Icons Automotive Bundle
 * Contains automotive-specific icons from the SVA icon set
 */

const AUTOMOTIVE_ICONS = {
  'accelerate': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 3.84L15.42 16H8.58L12 5.84z"/></svg>`,
  'brake': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3"/></svg>`,
  'battery': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>`,
  'charging': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/></svg>`,
  'car': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
  'airbag': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v8m-4-4h8"/></svg>`,
  'bluetooth': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/></svg>`,
  'android-auto': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H7V6h10v10z"/></svg>`,
  'apple-carplay': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`,
  'autonomous-driving': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 3.84L15.42 16H8.58L12 5.84z"/><circle cx="12" cy="12" r="2"/></svg>`
};

// Bundle metadata
const AUTOMOTIVE_BUNDLE_METADATA = {
  name: 'automotive',
  version: '1.0.0',
  description: 'Automotive and vehicle-related icons',
  icons: Object.keys(AUTOMOTIVE_ICONS),
  size: JSON.stringify(AUTOMOTIVE_ICONS).length,
  dependencies: ['core'],
  tags: ['automotive', 'vehicle', 'car', 'transport']
};

// Export for bundle system
if (typeof window !== 'undefined' && window.SvaIcons && window.SvaIcons.bundleRegistry) {
  window.SvaIcons.bundleRegistry.registerBundle('automotive', {
    icons: AUTOMOTIVE_ICONS,
    metadata: AUTOMOTIVE_BUNDLE_METADATA
  });
}

// Module export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    icons: AUTOMOTIVE_ICONS,
    metadata: AUTOMOTIVE_BUNDLE_METADATA
  };
}
