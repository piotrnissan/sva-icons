/**
 * SVA Icons Accessibility Enhancement Module
 * Provides comprehensive accessibility features including ARIA attributes,
 * role assignment, screen reader optimization, and inclusive design support.
 */

/**
 * Accessibility configuration with default values
 */
const ACCESSIBILITY_CONFIG = {
  enableAutoAria: true,           // Auto-generate ARIA attributes
  enableRoleAssignment: true,     // Auto-assign appropriate roles
  enableScreenReaderSupport: true, // Optimize for screen readers
  enableHighContrast: true,       // Support high contrast mode
  enableFocusManagement: true,    // Manage focus indicators
  enableKeyboardNavigation: true, // Support keyboard navigation
  enableReducedMotion: true,      // Respect reduced motion preferences
  preserveExistingAria: true,     // Preserve existing ARIA attributes
  defaultRole: 'img',             // Default role for icons
  announceIconChanges: false,     // Announce dynamic icon changes
  enableColorContrastCheck: true, // Validate color contrast
  enableSemanticEnhancement: true // Enhance semantic meaning
};

/**
 * ARIA role definitions and rules
 */
const ARIA_ROLES = {
  // Interactive roles
  button: {
    role: 'button',
    requiredAttributes: ['aria-label'],
    optionalAttributes: ['aria-pressed', 'aria-expanded', 'aria-describedby'],
    keyboardSupport: true,
    focusable: true
  },
  link: {
    role: 'link',
    requiredAttributes: ['aria-label'],
    optionalAttributes: ['aria-describedby'],
    keyboardSupport: true,
    focusable: true
  },
  tab: {
    role: 'tab',
    requiredAttributes: ['aria-label', 'aria-controls'],
    optionalAttributes: ['aria-selected', 'aria-describedby'],
    keyboardSupport: true,
    focusable: true
  },
  
  // Display roles
  img: {
    role: 'img',
    requiredAttributes: ['aria-label'],
    optionalAttributes: ['aria-describedby'],
    keyboardSupport: false,
    focusable: false
  },
  presentation: {
    role: 'presentation',
    requiredAttributes: [],
    optionalAttributes: [],
    keyboardSupport: false,
    focusable: false
  },
  
  // Status roles
  status: {
    role: 'status',
    requiredAttributes: ['aria-label'],
    optionalAttributes: ['aria-live', 'aria-atomic'],
    keyboardSupport: false,
    focusable: false
  },
  alert: {
    role: 'alert',
    requiredAttributes: ['aria-label'],
    optionalAttributes: ['aria-describedby'],
    keyboardSupport: false,
    focusable: false
  }
};

/**
 * Icon semantic mapping for better accessibility context
 */
const ICON_SEMANTICS = {
  // Navigation icons
  'arrow-left': { semantic: 'previous', context: 'navigation' },
  'arrow-right': { semantic: 'next', context: 'navigation' },
  'arrow-up': { semantic: 'up', context: 'navigation' },
  'arrow-down': { semantic: 'down', context: 'navigation' },
  'back': { semantic: 'go back', context: 'navigation' },
  'forward': { semantic: 'go forward', context: 'navigation' },
  'home': { semantic: 'home page', context: 'navigation' },
  'menu': { semantic: 'menu', context: 'navigation' },
  'close': { semantic: 'close', context: 'action' },
  
  // Status icons
  'check': { semantic: 'success', context: 'status' },
  'error': { semantic: 'error', context: 'status' },
  'warning': { semantic: 'warning', context: 'status' },
  'info': { semantic: 'information', context: 'status' },
  'alert': { semantic: 'alert', context: 'status' },
  
  // Action icons
  'plus': { semantic: 'add', context: 'action' },
  'minus': { semantic: 'remove', context: 'action' },
  'edit': { semantic: 'edit', context: 'action' },
  'delete': { semantic: 'delete', context: 'action' },
  'save': { semantic: 'save', context: 'action' },
  'search': { semantic: 'search', context: 'action' },
  'filter': { semantic: 'filter', context: 'action' },
  'settings': { semantic: 'settings', context: 'action' },
  
  // Media icons
  'play': { semantic: 'play', context: 'media' },
  'pause': { semantic: 'pause', context: 'media' },
  'stop': { semantic: 'stop', context: 'media' },
  'volume': { semantic: 'volume', context: 'media' },
  'mute': { semantic: 'mute', context: 'media' },
  
  // Automotive icons
  'car': { semantic: 'vehicle', context: 'automotive' },
  'battery': { semantic: 'battery', context: 'automotive' },
  'engine': { semantic: 'engine', context: 'automotive' },
  'fuel': { semantic: 'fuel level', context: 'automotive' }
};

/**
 * Accessibility analyzer for element context analysis
 */
class AccessibilityAnalyzer {
  constructor() {
    this.contextRules = new Map();
    this.initializeContextRules();
  }

  /**
   * Initialize context analysis rules
   */
  initializeContextRules() {
    // Button context detection
    this.contextRules.set('button', {
      selectors: ['button', '[role="button"]', '.btn', '.button'],
      parentCheck: (element) => {
        return element.closest('button, [role="button"], .btn, .button') !== null;
      },
      defaultRole: 'button'
    });

    // Link context detection
    this.contextRules.set('link', {
      selectors: ['a[href]', '[role="link"]'],
      parentCheck: (element) => {
        return element.closest('a[href], [role="link"]') !== null;
      },
      defaultRole: 'link'
    });

    // Form context detection
    this.contextRules.set('form', {
      selectors: ['label', '.form-control', '.input-group'],
      parentCheck: (element) => {
        return element.closest('label, .form-control, .input-group, form') !== null;
      },
      defaultRole: 'img'
    });

    // Navigation context detection
    this.contextRules.set('navigation', {
      selectors: ['nav', '[role="navigation"]', '.navbar', '.nav'],
      parentCheck: (element) => {
        return element.closest('nav, [role="navigation"], .navbar, .nav') !== null;
      },
      defaultRole: 'img'
    });

    // Status context detection
    this.contextRules.set('status', {
      selectors: ['.alert', '.notification', '.toast', '[role="status"]', '[role="alert"]'],
      parentCheck: (element) => {
        return element.closest('.alert, .notification, .toast, [role="status"], [role="alert"]') !== null;
      },
      defaultRole: 'status'
    });
  }

  /**
   * Analyze element context to determine appropriate accessibility treatment
   * @param {Element} element - Element to analyze
   * @returns {object} Context analysis result
   */
  analyzeContext(element) {
    const context = {
      type: 'decorative',
      role: ACCESSIBILITY_CONFIG.defaultRole,
      interactive: false,
      focusable: false,
      keyboardSupport: false,
      semanticContext: null
    };

    // Check each context rule
    for (const [contextType, rule] of this.contextRules) {
      if (rule.parentCheck(element)) {
        context.type = contextType;
        context.role = rule.defaultRole;
        
        // Set interactivity based on context
        if (contextType === 'button' || contextType === 'link') {
          context.interactive = true;
          context.focusable = true;
          context.keyboardSupport = true;
        }
        
        break;
      }
    }

    // Analyze existing attributes
    const existingRole = element.getAttribute('role');
    if (existingRole && ARIA_ROLES[existingRole]) {
      context.role = existingRole;
      context.interactive = ARIA_ROLES[existingRole].focusable;
      context.focusable = ARIA_ROLES[existingRole].focusable;
      context.keyboardSupport = ARIA_ROLES[existingRole].keyboardSupport;
    }

    // Check for existing aria-hidden
    if (element.getAttribute('aria-hidden') === 'true') {
      context.type = 'hidden';
      context.role = 'presentation';
      context.interactive = false;
      context.focusable = false;
      context.keyboardSupport = false;
    }

    return context;
  }

  /**
   * Get semantic information for an icon
   * @param {string} iconName - Icon name
   * @returns {object} Semantic information
   */
  getIconSemantics(iconName) {
    const normalizedName = iconName.toLowerCase().replace(/^sva-icon-/, '');
    return ICON_SEMANTICS[normalizedName] || {
      semantic: normalizedName.replace(/-/g, ' '),
      context: 'general'
    };
  }

  /**
   * Determine if element should be focusable
   * @param {Element} element - Element to check
   * @param {object} context - Element context
   * @returns {boolean} Whether element should be focusable
   */
  shouldBeFocusable(element, context) {
    // Already focusable
    if (element.tabIndex >= 0) return true;
    
    // Interactive contexts should be focusable
    if (context.interactive) return true;
    
    // Has click handlers
    if (element.onclick || element.getAttribute('onclick')) return true;
    
    // Has keyboard event handlers
    const hasKeyboardHandlers = ['onkeydown', 'onkeyup', 'onkeypress']
      .some(handler => element[handler] || element.getAttribute(handler));
    
    return hasKeyboardHandlers;
  }

  /**
   * Generate appropriate ARIA label for icon
   * @param {string} iconName - Icon name
   * @param {object} context - Element context
   * @param {Element} element - DOM element
   * @returns {string} Generated ARIA label
   */
  generateAriaLabel(iconName, context, element) {
    // Check for existing labels
    const existingLabel = element.getAttribute('aria-label') || 
                         element.getAttribute('aria-labelledby') ||
                         element.getAttribute('title');
    
    if (existingLabel && ACCESSIBILITY_CONFIG.preserveExistingAria) {
      return existingLabel;
    }

    // Get semantic information
    const semantics = this.getIconSemantics(iconName);
    
    // Generate context-appropriate label
    let label = semantics.semantic;
    
    // Enhance based on context
    switch (context.type) {
      case 'button':
        label = this.enhanceLabelForButton(label, element);
        break;
      case 'link':
        label = this.enhanceLabelForLink(label, element);
        break;
      case 'status':
        label = this.enhanceLabelForStatus(label, semantics.context);
        break;
      case 'navigation':
        label = this.enhanceLabelForNavigation(label);
        break;
    }

    return label;
  }

  /**
   * Enhance label for button context
   * @param {string} baseLabel - Base label
   * @param {Element} element - Button element
   * @returns {string} Enhanced label
   */
  enhanceLabelForButton(baseLabel, element) {
    // Check for accompanying text
    const buttonText = element.textContent?.trim();
    if (buttonText && !buttonText.includes(baseLabel)) {
      return `${baseLabel} ${buttonText}`.trim();
    }
    
    // Add "button" suffix if not clear
    if (!baseLabel.includes('button') && !buttonText) {
      return `${baseLabel} button`;
    }
    
    return baseLabel;
  }

  /**
   * Enhance label for link context
   * @param {string} baseLabel - Base label
   * @param {Element} element - Link element
   * @returns {string} Enhanced label
   */
  enhanceLabelForLink(baseLabel, element) {
    const linkElement = element.closest('a[href]');
    if (linkElement) {
      const href = linkElement.getAttribute('href');
      const linkText = linkElement.textContent?.trim();
      
      if (linkText && !linkText.includes(baseLabel)) {
        return `${baseLabel}, ${linkText}`;
      }
      
      // Add destination context if useful
      if (href && href !== '#' && !baseLabel.includes('link')) {
        return `${baseLabel} link`;
      }
    }
    
    return baseLabel;
  }

  /**
   * Enhance label for status context
   * @param {string} baseLabel - Base label
   * @param {string} semanticContext - Semantic context
   * @returns {string} Enhanced label
   */
  enhanceLabelForStatus(baseLabel, semanticContext) {
    const statusPrefixes = {
      status: 'Status:',
      error: 'Error:',
      warning: 'Warning:',
      success: 'Success:',
      info: 'Information:'
    };
    
    const prefix = statusPrefixes[semanticContext] || '';
    return prefix ? `${prefix} ${baseLabel}` : baseLabel;
  }

  /**
   * Enhance label for navigation context
   * @param {string} baseLabel - Base label
   * @returns {string} Enhanced label
   */
  enhanceLabelForNavigation(baseLabel) {
    const navigationSuffixes = {
      'previous': 'Go to previous page',
      'next': 'Go to next page',
      'up': 'Go up',
      'down': 'Go down',
      'home': 'Go to home page',
      'menu': 'Open menu'
    };
    
    return navigationSuffixes[baseLabel] || baseLabel;
  }
}

/**
 * ARIA attribute manager
 */
class AriaAttributeManager {
  constructor(analyzer) {
    this.analyzer = analyzer;
    this.appliedAttributes = new WeakMap();
  }

  /**
   * Apply ARIA attributes to an element
   * @param {Element} element - Element to enhance
   * @param {string} iconName - Icon name
   * @param {object} context - Element context
   */
  applyAriaAttributes(element, iconName, context) {
    if (!ACCESSIBILITY_CONFIG.enableAutoAria) return;

    const attributes = this.generateAriaAttributes(element, iconName, context);
    const applied = [];

    // Apply each attribute
    Object.entries(attributes).forEach(([attr, value]) => {
      if (this.shouldApplyAttribute(element, attr, value)) {
        element.setAttribute(attr, value);
        applied.push({ attr, value });
      }
    });

    // Store applied attributes for tracking
    this.appliedAttributes.set(element, {
      iconName,
      context: context.type,
      attributes: applied,
      timestamp: Date.now()
    });

    // Add accessibility data attribute for testing
    element.setAttribute('data-sva-a11y', 'enhanced');
  }

  /**
   * Generate ARIA attributes for element
   * @param {Element} element - Element to analyze
   * @param {string} iconName - Icon name
   * @param {object} context - Element context
   * @returns {object} Generated ARIA attributes
   */
  generateAriaAttributes(element, iconName, context) {
    const attributes = {};

    // Set role
    if (ACCESSIBILITY_CONFIG.enableRoleAssignment && !element.getAttribute('role')) {
      attributes.role = context.role;
    }

    // Set aria-label
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      const label = this.analyzer.generateAriaLabel(iconName, context, element);
      if (label) {
        attributes['aria-label'] = label;
      }
    }

    // Set aria-hidden for decorative icons
    if (context.type === 'decorative' && !element.getAttribute('aria-hidden')) {
      attributes['aria-hidden'] = 'true';
    }

    // Set focusability
    if (context.focusable && !element.hasAttribute('tabindex')) {
      attributes.tabindex = '0';
    } else if (!context.focusable && context.type === 'decorative') {
      attributes.tabindex = '-1';
    }

    // Add live region attributes for status icons
    if (context.type === 'status') {
      if (!element.getAttribute('aria-live')) {
        attributes['aria-live'] = 'polite';
      }
      if (!element.getAttribute('aria-atomic')) {
        attributes['aria-atomic'] = 'true';
      }
    }

    // Add button-specific attributes
    if (context.type === 'button' || context.role === 'button') {
      const buttonElement = element.closest('button, [role="button"]');
      if (buttonElement) {
        // Check for toggle buttons
        if (buttonElement.classList.contains('toggle') || 
            buttonElement.getAttribute('aria-pressed') !== null) {
          if (!buttonElement.getAttribute('aria-pressed')) {
            attributes['aria-pressed'] = 'false';
          }
        }
        
        // Check for expandable buttons
        if (buttonElement.classList.contains('expandable') ||
            buttonElement.getAttribute('aria-expanded') !== null) {
          if (!buttonElement.getAttribute('aria-expanded')) {
            attributes['aria-expanded'] = 'false';
          }
        }
      }
    }

    return attributes;
  }

  /**
   * Check if attribute should be applied
   * @param {Element} element - Element to check
   * @param {string} attr - Attribute name
   * @param {string} value - Attribute value
   * @returns {boolean} Whether to apply attribute
   */
  shouldApplyAttribute(element, attr, value) {
    // Don't override existing attributes if preservation is enabled
    if (ACCESSIBILITY_CONFIG.preserveExistingAria && element.hasAttribute(attr)) {
      return false;
    }

    // Don't apply empty values
    if (!value && value !== '0' && value !== 'false') {
      return false;
    }

    // Special cases
    if (attr === 'tabindex') {
      // Don't override existing tabindex unless it's -1 and we need 0
      const existing = element.getAttribute('tabindex');
      if (existing !== null && !(existing === '-1' && value === '0')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Remove applied ARIA attributes
   * @param {Element} element - Element to clean
   */
  removeAriaAttributes(element) {
    const applied = this.appliedAttributes.get(element);
    if (!applied) return;

    applied.attributes.forEach(({ attr }) => {
      element.removeAttribute(attr);
    });

    element.removeAttribute('data-sva-a11y');
    this.appliedAttributes.delete(element);
  }

  /**
   * Get applied attributes for element
   * @param {Element} element - Element to check
   * @returns {object|null} Applied attributes info
   */
  getAppliedAttributes(element) {
    return this.appliedAttributes.get(element) || null;
  }
}

/**
 * Focus management for keyboard navigation
 */
class FocusManager {
  constructor() {
    this.focusableElements = new Set();
    this.focusHandlers = new WeakMap();
  }

  /**
   * Make element focusable with proper focus handling
   * @param {Element} element - Element to make focusable
   * @param {object} context - Element context
   */
  manageFocus(element, context) {
    if (!ACCESSIBILITY_CONFIG.enableFocusManagement) return;

    if (context.focusable) {
      this.addFocusSupport(element, context);
    } else {
      this.removeFocusSupport(element);
    }
  }

  /**
   * Add focus support to element
   * @param {Element} element - Element to enhance
   * @param {object} context - Element context
   */
  addFocusSupport(element, context) {
    // Ensure element is focusable
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    // Add focus styling
    element.classList.add('sva-icon--focusable');

    // Add keyboard event handlers
    if (context.keyboardSupport) {
      const handlers = this.createKeyboardHandlers(element, context);
      this.focusHandlers.set(element, handlers);

      element.addEventListener('keydown', handlers.keydown);
      element.addEventListener('keyup', handlers.keyup);
    }

    // Add focus/blur handlers for styling
    const focusHandler = () => element.classList.add('sva-icon--focused');
    const blurHandler = () => element.classList.remove('sva-icon--focused');

    element.addEventListener('focus', focusHandler);
    element.addEventListener('blur', blurHandler);

    // Store handlers for cleanup
    if (!this.focusHandlers.has(element)) {
      this.focusHandlers.set(element, {});
    }
    this.focusHandlers.get(element).focus = focusHandler;
    this.focusHandlers.get(element).blur = blurHandler;

    this.focusableElements.add(element);
  }

  /**
   * Remove focus support from element
   * @param {Element} element - Element to clean
   */
  removeFocusSupport(element) {
    const handlers = this.focusHandlers.get(element);
    if (handlers) {
      if (handlers.keydown) element.removeEventListener('keydown', handlers.keydown);
      if (handlers.keyup) element.removeEventListener('keyup', handlers.keyup);
      if (handlers.focus) element.removeEventListener('focus', handlers.focus);
      if (handlers.blur) element.removeEventListener('blur', handlers.blur);
    }

    element.classList.remove('sva-icon--focusable', 'sva-icon--focused');
    this.focusHandlers.delete(element);
    this.focusableElements.delete(element);
  }

  /**
   * Create keyboard event handlers
   * @param {Element} element - Element to handle
   * @param {object} context - Element context
   * @returns {object} Event handlers
   */
  createKeyboardHandlers(element, context) {
    return {
      keydown: (event) => {
        // Handle Enter and Space for button-like elements
        if (context.type === 'button' || context.role === 'button') {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.activateElement(element);
          }
        }

        // Handle arrow keys for navigation
        if (context.type === 'navigation') {
          this.handleNavigationKeys(event, element);
        }

        // Announce action to screen readers
        if (ACCESSIBILITY_CONFIG.announceIconChanges) {
          this.announceKeyboardAction(element, event.key);
        }
      },

      keyup: (event) => {
        // Release visual feedback
        if (event.key === ' ') {
          element.classList.remove('sva-icon--active');
        }
      }
    };
  }

  /**
   * Activate element (simulate click)
   * @param {Element} element - Element to activate
   */
  activateElement(element) {
    element.classList.add('sva-icon--active');
    
    // Trigger click if element or parent is clickable
    const clickableParent = element.closest('button, a[href], [role="button"], [role="link"]');
    if (clickableParent) {
      clickableParent.click();
    } else if (element.click) {
      element.click();
    }

    // Remove active class after animation
    setTimeout(() => {
      element.classList.remove('sva-icon--active');
    }, 150);
  }

  /**
   * Handle navigation keyboard shortcuts
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Element} element - Current element
   */
  handleNavigationKeys(event, element) {
    const { key } = event;
    
    // Find navigation container
    const navContainer = element.closest('nav, [role="navigation"], .navbar, .nav');
    if (!navContainer) return;

    const focusableInNav = Array.from(navContainer.querySelectorAll(
      'a[href], button, [tabindex="0"], [role="button"], [role="link"]'
    )).filter(el => !el.hasAttribute('disabled'));

    const currentIndex = focusableInNav.indexOf(element.closest(
      'a[href], button, [tabindex="0"], [role="button"], [role="link"]'
    ));

    let targetIndex = -1;

    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        targetIndex = (currentIndex + 1) % focusableInNav.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        targetIndex = currentIndex > 0 ? currentIndex - 1 : focusableInNav.length - 1;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = focusableInNav.length - 1;
        break;
    }

    if (targetIndex >= 0 && focusableInNav[targetIndex]) {
      event.preventDefault();
      focusableInNav[targetIndex].focus();
    }
  }

  /**
   * Announce keyboard action to screen readers
   * @param {Element} element - Element being interacted with
   * @param {string} key - Key that was pressed
   */
  announceKeyboardAction(element, key) {
    const label = element.getAttribute('aria-label') || 'icon';
    const action = key === 'Enter' || key === ' ' ? 'activated' : 'focused';
    
    this.announceToScreenReader(`${label} ${action}`);
  }

  /**
   * Announce message to screen reader
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    // Create temporary live region for announcement
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';

    document.body.appendChild(announcer);
    announcer.textContent = message;

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
}

/**
 * High contrast and theme support
 */
class ThemeAccessibilityManager {
  constructor() {
    this.themeObserver = null;
    this.contrastLevel = 'normal';
    this.reducedMotion = false;
    this.initializeThemeDetection();
  }

  /**
   * Initialize theme and preference detection
   */
  initializeThemeDetection() {
    if (!ACCESSIBILITY_CONFIG.enableHighContrast && !ACCESSIBILITY_CONFIG.enableReducedMotion) {
      return;
    }

    // Detect high contrast mode
    this.detectHighContrast();

    // Detect reduced motion preference
    this.detectReducedMotion();

    // Set up media query listeners
    this.setupMediaQueryListeners();
  }

  /**
   * Detect high contrast mode
   */
  detectHighContrast() {
    // Windows high contrast detection
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      this.contrastLevel = 'high';
    } else if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
      this.contrastLevel = 'more';
    }

    // Apply high contrast styles
    if (this.contrastLevel !== 'normal') {
      document.documentElement.classList.add(`sva-icons--high-contrast`);
      document.documentElement.classList.add(`sva-icons--contrast-${this.contrastLevel}`);
    }
  }

  /**
   * Detect reduced motion preference
   */
  detectReducedMotion() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.reducedMotion = true;
      document.documentElement.classList.add('sva-icons--reduced-motion');
    }
  }

  /**
   * Set up media query listeners for theme changes
   */
  setupMediaQueryListeners() {
    // High contrast listener
    if (window.matchMedia) {
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      highContrastQuery.addEventListener('change', () => {
        this.detectHighContrast();
      });

      // Reduced motion listener
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedMotionQuery.addEventListener('change', () => {
        this.detectReducedMotion();
      });
    }
  }

  /**
   * Apply theme-specific accessibility enhancements
   * @param {Element} element - Element to enhance
   */
  applyThemeEnhancements(element) {
    // High contrast enhancements
    if (this.contrastLevel !== 'normal') {
      element.classList.add('sva-icon--high-contrast');
      
      // Ensure sufficient contrast
      this.ensureContrast(element);
    }

    // Reduced motion enhancements
    if (this.reducedMotion) {
      element.classList.add('sva-icon--reduced-motion');
    }
  }

  /**
   * Ensure sufficient color contrast for icon
   * @param {Element} element - Icon element
   */
  ensureContrast(element) {
    if (!ACCESSIBILITY_CONFIG.enableColorContrastCheck) return;

    // Get computed styles
    const styles = window.getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;

    // Simple contrast check (basic implementation)
    if (this.needsContrastAdjustment(color, backgroundColor)) {
      element.classList.add('sva-icon--contrast-adjusted');
    }
  }

  /**
   * Check if colors need contrast adjustment
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @returns {boolean} Whether adjustment is needed
   */
  needsContrastAdjustment(foreground, background) {
    // Simplified contrast check
    // In a real implementation, you'd calculate the actual contrast ratio
    const fgLuminance = this.getColorLuminance(foreground);
    const bgLuminance = this.getColorLuminance(background);
    
    const contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                         (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    // WCAG AA requires 3:1 for graphics
    return contrastRatio < 3;
  }

  /**
   * Get color luminance (simplified)
   * @param {string} color - Color string
   * @returns {number} Luminance value
   */
  getColorLuminance(color) {
    // Very simplified luminance calculation
    // In production, you'd use a proper color parsing library
    if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return 1;
    if (color.includes('rgb(0, 0, 0)') || color === 'black') return 0;
    if (color.includes('rgb(255, 255, 255)') || color === 'white') return 1;
    
    return 0.5; // Default middle value
  }
}

/**
 * Main accessibility enhancer class
 */
class AccessibilityEnhancer {
  constructor(config = {}) {
    this.config = { ...ACCESSIBILITY_CONFIG, ...config };
    this.analyzer = new AccessibilityAnalyzer();
    this.ariaManager = new AriaAttributeManager(this.analyzer);
    this.focusManager = new FocusManager();
    this.themeManager = new ThemeAccessibilityManager();
    this.enhancedElements = new WeakSet();
    this.stats = {
      enhancedElements: 0,
      rolesAssigned: 0,
      ariaAttributesAdded: 0,
      focusableElementsCreated: 0
    };
  }

  /**
   * Enhance element accessibility
   * @param {Element} element - Element to enhance
   * @param {string} iconName - Icon name
   */
  enhanceElement(element, iconName) {
    if (this.enhancedElements.has(element)) return;

    // Analyze element context
    const context = this.analyzer.analyzeContext(element);

    // Apply ARIA attributes
    this.ariaManager.applyAriaAttributes(element, iconName, context);
    this.stats.ariaAttributesAdded++;

    // Manage focus
    this.focusManager.manageFocus(element, context);
    if (context.focusable) {
      this.stats.focusableElementsCreated++;
    }

    // Apply theme enhancements
    this.themeManager.applyThemeEnhancements(element);

    // Add semantic enhancement class
    if (this.config.enableSemanticEnhancement) {
      const semantics = this.analyzer.getIconSemantics(iconName);
      element.classList.add(`sva-icon--semantic-${semantics.context}`);
    }

    // Mark as enhanced
    this.enhancedElements.add(element);
    this.stats.enhancedElements++;

    // Log enhancement for debugging
    if (this.config.enableDebugLogging) {
      console.log('SVA Icon enhanced for accessibility:', {
        element,
        iconName,
        context,
        stats: this.stats
      });
    }
  }

  /**
   * Remove accessibility enhancements from element
   * @param {Element} element - Element to clean
   */
  removeEnhancements(element) {
    if (!this.enhancedElements.has(element)) return;

    this.ariaManager.removeAriaAttributes(element);
    this.focusManager.removeFocusSupport(element);

    // Remove semantic classes
    const semanticClasses = Array.from(element.classList)
      .filter(cls => cls.startsWith('sva-icon--semantic-'));
    semanticClasses.forEach(cls => element.classList.remove(cls));

    // Remove theme classes
    element.classList.remove(
      'sva-icon--high-contrast',
      'sva-icon--reduced-motion',
      'sva-icon--contrast-adjusted'
    );

    this.enhancedElements.delete(element);
  }

  /**
   * Get accessibility report for element
   * @param {Element} element - Element to analyze
   * @returns {object} Accessibility report
   */
  getAccessibilityReport(element) {
    const context = this.analyzer.analyzeContext(element);
    const appliedAttributes = this.ariaManager.getAppliedAttributes(element);
    
    return {
      element: {
        tagName: element.tagName.toLowerCase(),
        className: element.className,
        id: element.id
      },
      context,
      appliedAttributes,
      isEnhanced: this.enhancedElements.has(element),
      accessibility: {
        hasAriaLabel: !!element.getAttribute('aria-label'),
        hasRole: !!element.getAttribute('role'),
        isFocusable: element.tabIndex >= 0,
        isHidden: element.getAttribute('aria-hidden') === 'true'
      },
      compliance: this.checkComplianceLevel(element, context)
    };
  }

  /**
   * Check WCAG compliance level
   * @param {Element} element - Element to check
   * @param {object} context - Element context
   * @returns {object} Compliance information
   */
  checkComplianceLevel(element, context) {
    const compliance = {
      level: 'AAA',
      issues: [],
      score: 100
    };

    // Check for required ARIA attributes
    const roleInfo = ARIA_ROLES[context.role];
    if (roleInfo && roleInfo.requiredAttributes) {
      roleInfo.requiredAttributes.forEach(attr => {
        if (!element.getAttribute(attr)) {
          compliance.issues.push(`Missing required attribute: ${attr}`);
          compliance.score -= 20;
        }
      });
    }

    // Check focus management
    if (context.interactive && element.tabIndex < 0) {
      compliance.issues.push('Interactive element not focusable');
      compliance.score -= 15;
    }

    // Check for appropriate role
    if (!element.getAttribute('role') && context.type !== 'decorative') {
      compliance.issues.push('Missing role attribute');
      compliance.score -= 10;
    }

    // Determine compliance level
    if (compliance.score >= 90) compliance.level = 'AAA';
    else if (compliance.score >= 80) compliance.level = 'AA';
    else if (compliance.score >= 60) compliance.level = 'A';
    else compliance.level = 'Non-compliant';

    return compliance;
  }

  /**
   * Get overall accessibility statistics
   * @returns {object} Accessibility statistics
   */
  getStats() {
    return {
      ...this.stats,
      themeSettings: {
        contrastLevel: this.themeManager.contrastLevel,
        reducedMotion: this.themeManager.reducedMotion
      },
      config: this.config
    };
  }

  /**
   * Update configuration
   * @param {object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Update child components if needed
    Object.assign(ACCESSIBILITY_CONFIG, this.config);
  }

  /**
   * Reset all accessibility enhancements
   */
  reset() {
    // Clear all enhanced elements
    this.enhancedElements = new WeakSet();
    
    // Reset statistics
    this.stats = {
      enhancedElements: 0,
      rolesAssigned: 0,
      ariaAttributesAdded: 0,
      focusableElementsCreated: 0
    };
  }
}

// Export classes and default instance
export {
  AccessibilityEnhancer,
  AccessibilityAnalyzer,
  AriaAttributeManager,
  FocusManager,
  ThemeAccessibilityManager,
  ACCESSIBILITY_CONFIG,
  ARIA_ROLES,
  ICON_SEMANTICS
};

// Create and export default instance
export const accessibilityEnhancer = new AccessibilityEnhancer();

// Auto-initialize accessibility features
if (typeof window !== 'undefined' && window.document) {
  // Add accessibility CSS classes to document
  document.documentElement.classList.add('sva-icons-a11y-enabled');
  
  // Initialize theme detection
  accessibilityEnhancer.themeManager.initializeThemeDetection();
}
