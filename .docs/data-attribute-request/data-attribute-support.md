# Feature Request: Data Attribute-Based Icon Injection

**Date**: July 3, 2025  
**Priority**: High  
**Type**: Feature Enhancement  
**Affects**: SVA Icons v3.1.0 Auto-Registration System  

## 🎯 Problem Statement

The SVA Framework uses CSS classes starting with `sva-icon` for icon styling and sizing (e.g., `sva-icon`, `sva-icon--s`, `sva-icon--m`). This creates naming conflicts with SVA Icons v3.1.0 auto-registration system, which also scans for classes starting with `sva-icon-` for content injection.

### Current Conflict
```html
<!-- SVA Framework icon sizing classes conflict with SVA Icons scanning -->
<span class="sva-icon sva-icon--s sva-icon-plus"></span>
<!--                ^^^^^^^^^^^ ^^^^^^^^^^^^ -->
<!--                Framework   SVA Icons   -->
<!--                styling     content     -->
```

The auto-registration script may incorrectly process styling modifiers (`sva-icon--s`) as icon names, causing injection failures or unexpected behavior.

## 💡 Proposed Solution

Add support for **data attribute-based icon injection** as an alternative to CSS class-based injection.

### Proposed HTML Structure
```html
<!-- Clean separation: classes for styling, data attributes for content -->
<span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>
<span class="sva-icon sva-icon--m" data-sva-icon="settings"></span>
<span class="sva-icon sva-icon--l" data-sva-icon="arrow-right"></span>
```

### Alternative Data Attribute Names
- `data-sva-icon="icon-name"` (preferred)
- `data-icon="icon-name"` (simpler)
- `data-sva-icon-name="icon-name"` (more explicit)

## 🔧 Implementation Requirements

### 1. Configuration Option
```javascript
await svaIcons.initializeClassBasedIcons({
    registerBundles: ['ui-essentials'],
    scanDOM: true,
    enableObserver: true,
    
    // NEW: Support for data attribute scanning
    dataAttributeSupport: {
        enabled: true,
        attributeName: 'data-sva-icon', // or 'data-icon'
        selector: '[data-sva-icon]'     // custom selector
    }
});
```

### 2. Scanning Logic
The auto-registration system should scan for both:
- **CSS Classes** (existing): `[class*="sva-icon-"]:not([class*="sva-icon--"])`
- **Data Attributes** (new): `[data-sva-icon]`

### 3. Injection Behavior
```html
<!-- Before injection -->
<span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>

<!-- After injection -->
<span class="sva-icon sva-icon--s" data-sva-icon="plus">
    <svg><!-- plus icon SVG content --></svg>
</span>
```

## ✅ Benefits

### For SVA Framework Integration
- **✅ No Naming Conflicts**: Framework styling classes separate from content injection
- **✅ Cleaner HTML**: More semantic separation of concerns
- **✅ Better Maintainability**: Easier to distinguish styling from content
- **✅ Future-Proof**: Won't conflict with future framework CSS class additions

### For SVA Icons Library
- **✅ Backward Compatibility**: Existing CSS class approach still works
- **✅ More Flexible**: Developers can choose their preferred approach
- **✅ Better Framework Integration**: Easier adoption in component frameworks
- **✅ Semantic HTML**: More accessible and meaningful markup

### For Developer Experience
- **✅ Less Confusion**: Clear distinction between styling and content
- **✅ Easier Debugging**: Obvious what triggers icon injection
- **✅ Framework Agnostic**: Works consistently across React, Vue, Angular, vanilla JS

## 🧪 Test Cases

### Test Case 1: Basic Data Attribute Injection
```html
<span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>
<!-- Expected: SVG plus icon injected, 16px size applied -->
```

### Test Case 2: Multiple Icons with Different Sizes
```html
<span class="sva-icon sva-icon--xs" data-sva-icon="star"></span>
<span class="sva-icon sva-icon--m" data-sva-icon="heart"></span>
<span class="sva-icon sva-icon--xl" data-sva-icon="check"></span>
<!-- Expected: All icons injected with correct sizes -->
```

### Test Case 3: Dynamic Icon Changes
```javascript
// Should trigger re-injection
element.setAttribute('data-sva-icon', 'new-icon-name');
```

### Test Case 4: Observer Integration
```html
<!-- Should auto-inject when added to DOM -->
document.body.appendChild('<span class="sva-icon sva-icon--m" data-sva-icon="plus"></span>');
```

## 🔗 Integration Points

### SVA Framework Button Component
```html
<!-- Current (problematic) -->
<button class="sva-c-button">
    <span class="sva-icon sva-icon--s sva-icon-plus"></span>
    Add Item
</button>

<!-- Proposed (clean) -->
<button class="sva-c-button">
    <span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>
    Add Item
</button>
```

### React Component Integration
```tsx
interface IconProps {
    name: string;
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
}

const Icon: React.FC<IconProps> = ({ name, size = 'm' }) => (
    <span 
        className={`sva-icon sva-icon--${size}`}
        data-sva-icon={name}
    />
);
```

### Web Component Integration
```javascript
class SvaIcon extends HTMLElement {
    connectedCallback() {
        this.className = `sva-icon sva-icon--${this.size}`;
        this.setAttribute('data-sva-icon', this.iconName);
    }
}
```

## 📊 Impact Assessment

### High Impact Areas
- **SVA Framework Core**: All icon-containing components (buttons, inputs, navigation)
- **Component Libraries**: React, Vue, Angular implementations
- **Documentation**: Examples and migration guides
- **Developer Training**: Updated development patterns

### Migration Strategy
1. **Phase 1**: Implement data attribute support (backward compatible)
2. **Phase 2**: Update SVA Framework to use data attributes
3. **Phase 3**: Deprecate mixed CSS class approach (optional)
4. **Phase 4**: Documentation and training updates

## 🚀 Acceptance Criteria

- [ ] SVA Icons v3.1.0+ supports `data-sva-icon` attribute scanning
- [ ] Configuration option to enable/disable data attribute support
- [ ] DOM observer detects dynamically added data attribute icons
- [ ] Backward compatibility with existing CSS class approach
- [ ] Performance impact minimal (< 5% overhead)
- [ ] Works with all existing icon bundles and themes
- [ ] Documentation updated with data attribute examples
- [ ] Unit tests cover data attribute injection scenarios

## 🔗 Related Issues

- SVA Framework icon migration to v3.1.0
- Component library icon integration patterns
- Performance optimization for large icon sets

## 👥 Stakeholders

- **SVA Icons Team**: Implementation
- **SVA Framework Team**: Integration and testing
- **Component Library Teams**: React, Vue, Angular implementations
- **Documentation Team**: Guide updates
- **QA Team**: Testing across frameworks

---

**Contact**: SVA Framework Team  
**Next Steps**: Review feasibility and implementation timeline
