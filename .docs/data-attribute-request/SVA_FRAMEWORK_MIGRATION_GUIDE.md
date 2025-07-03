# SVA Framework Migration Guide - Data Attribute Icons v3.1.1

**Date**: July 3, 2025  
**Target Audience**: SVA Framework Development Team  
**SVA Icons Version**: v3.1.1+  

---

## 🎯 Overview

This guide provides step-by-step instructions for migrating SVA Framework to use the new **data attribute-based icon injection** system in SVA Icons v3.1.1. This approach eliminates CSS class conflicts and provides clean separation between styling and content.

### 🚫 **Problem Solved**
```html
<!-- OLD: CSS class conflicts -->
<span class="sva-icon sva-icon--s sva-icon-plus"></span>
<!--                ^^^^^^^^^^^ ^^^^^^^^^^^^ -->
<!--                Framework   SVA Icons   -->
<!--                styling     content     -->
```

### ✅ **New Solution**
```html
<!-- NEW: Clean separation -->
<span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>
<!--                ^^^^^^^^^^^ ^^^^^^^^^^^^^^^ -->
<!--                Framework   SVA Icons      -->
<!--                styling     content        -->
```

---

## 📦 Installation & Setup

### 1. Update SVA Icons Dependency

```bash
npm install sva-icons@^3.1.1
# or
yarn add sva-icons@^3.1.1
```

### 2. Initialize Data Attribute System

```javascript
// In your main application file (e.g., app.js, main.js)
import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

// Initialize once when your app starts
await initializeClassBasedIcons({
    registerBundles: [
        'ui-essentials',    // plus, minus, settings, search, etc.
        'automotive-core',  // car, battery, charging, alert, etc.
        'navigation',       // arrows, directions, map-view
        'communication',    // phone, email, chat, message
        'media',           // play, pause, volume, camera
        'commerce'         // price, payment, offers
    ],
    scanDOM: true,          // Scan existing DOM for data attributes
    enableObserver: true    // Watch for dynamic content (SPAs)
});
```

---

## 🔄 Migration Steps

### Step 1: Update Base Icon Component

**Before (v3.1.0):**
```jsx
// Old SVA Framework icon component
function SvaIcon({ name, size = 'm', className = '', ...props }) {
    return (
        <span 
            className={`sva-icon sva-icon--${size} sva-icon-${name} ${className}`}
            {...props}
        />
    );
}
```

**After (v3.1.1):**
```jsx
// New SVA Framework icon component
function SvaIcon({ name, size = 'm', className = '', ...props }) {
    return (
        <span 
            className={`sva-icon sva-icon--${size} ${className}`}
            data-sva-icon={name}
            {...props}
        />
    );
}
```

### Step 2: Update Button Components

**Before:**
```jsx
function SvaButton({ icon, children, size = 'm', variant = 'primary', ...props }) {
    return (
        <button className={`sva-button sva-button--${variant}`} {...props}>
            {icon && (
                <span className={`sva-icon sva-icon--${size} sva-icon-${icon}`} />
            )}
            {children}
        </button>
    );
}
```

**After:**
```jsx
function SvaButton({ icon, children, size = 'm', variant = 'primary', ...props }) {
    return (
        <button className={`sva-button sva-button--${variant}`} {...props}>
            {icon && (
                <span 
                    className={`sva-icon sva-icon--${size}`}
                    data-sva-icon={icon}
                />
            )}
            {children}
        </button>
    );
}
```

### Step 3: Update Input Components

**Before:**
```jsx
function SvaInput({ icon, placeholder, ...props }) {
    return (
        <div className="sva-input-group">
            <input className="sva-input" placeholder={placeholder} {...props} />
            {icon && (
                <span className={`sva-icon sva-icon--s sva-icon-${icon} sva-input__icon`} />
            )}
        </div>
    );
}
```

**After:**
```jsx
function SvaInput({ icon, placeholder, ...props }) {
    return (
        <div className="sva-input-group">
            <input className="sva-input" placeholder={placeholder} {...props} />
            {icon && (
                <span 
                    className="sva-icon sva-icon--s sva-input__icon"
                    data-sva-icon={icon}
                />
            )}
        </div>
    );
}
```

---

## 🛠️ Framework-Specific Implementation

### React Implementation

```jsx
// React Hook for icon initialization
import { useEffect } from 'react';
import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

export function useSvaIcons() {
    useEffect(() => {
        const initIcons = async () => {
            await initializeClassBasedIcons({
                registerBundles: ['ui-essentials', 'automotive-core'],
                scanDOM: true,
                enableObserver: true
            });
        };
        
        initIcons();
    }, []);
}

// Use in your App component
function App() {
    useSvaIcons(); // Initialize icons
    
    return (
        <div className="app">
            {/* Your app content */}
        </div>
    );
}
```

### Vue Implementation

```vue
<!-- Vue Plugin -->
<script>
import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

export default {
    install(app) {
        app.config.globalProperties.$initSvaIcons = async () => {
            await initializeClassBasedIcons({
                registerBundles: ['ui-essentials', 'automotive-core'],
                scanDOM: true,
                enableObserver: true
            });
        };
    }
}
</script>

<!-- Use in main.js -->
<script>
import { createApp } from 'vue';
import SvaIconsPlugin from './plugins/sva-icons';

const app = createApp(App);
app.use(SvaIconsPlugin);

app.mount('#app');

// Initialize icons after mounting
app.config.globalProperties.$initSvaIcons();
</script>
```

### Angular Implementation

```typescript
// Angular Service
import { Injectable } from '@angular/core';
import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

@Injectable({ providedIn: 'root' })
export class SvaIconsService {
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        await initializeClassBasedIcons({
            registerBundles: ['ui-essentials', 'automotive-core'],
            scanDOM: true,
            enableObserver: true
        });

        this.initialized = true;
    }
}

// Use in app.component.ts
import { Component, OnInit } from '@angular/core';
import { SvaIconsService } from './services/sva-icons.service';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private svaIcons: SvaIconsService) {}

    async ngOnInit() {
        await this.svaIcons.initialize();
    }
}
```

---

## 🔄 Bulk Migration Script

Use this script to help automate the migration process:

```javascript
// migration-helper.js
const fs = require('fs');
const path = require('path');

function migrateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace icon class pattern with data attribute pattern
    content = content.replace(
        /className=\{`([^`]*sva-icon[^`]*)\s+sva-icon-\$\{([^}]+)\}([^`]*)`\}/g,
        'className={`$1$3`} data-sva-icon={$2}'
    );
    
    // Replace literal icon classes
    content = content.replace(
        /className="([^"]*sva-icon[^"]*)\s+sva-icon-([^"\s]+)([^"]*)"/g,
        'className="$1$3" data-sva-icon="$2"'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated: ${filePath}`);
}

// Run migration on your component directories
const componentDirs = ['./src/components', './src/ui'];
// Add your specific directories here
```

---

## ✅ Validation & Testing

### 1. Visual Validation

After migration, verify icons are displaying correctly:

```html
<!-- Test page -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/sva-framework.css">
</head>
<body>
    <!-- Test various icon sizes -->
    <span class="sva-icon sva-icon--xs" data-sva-icon="plus"></span>
    <span class="sva-icon sva-icon--s" data-sva-icon="settings"></span>
    <span class="sva-icon sva-icon--m" data-sva-icon="car"></span>
    <span class="sva-icon sva-icon--l" data-sva-icon="battery"></span>
    
    <script type="module">
        import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';
        
        await initializeClassBasedIcons({
            registerBundles: ['ui-essentials', 'automotive-core'],
            scanDOM: true,
            enableObserver: true
        });
    </script>
</body>
</html>
```

### 2. Performance Testing

```javascript
// Performance test
console.time('Icon Initialization');

await initializeClassBasedIcons({
    registerBundles: ['ui-essentials', 'automotive-core'],
    scanDOM: true,
    enableObserver: true
});

console.timeEnd('Icon Initialization');
// Expected: < 50ms for typical page loads
```

### 3. Dynamic Content Testing

```javascript
// Test dynamic content injection
function addDynamicContent() {
    const container = document.getElementById('dynamic-content');
    
    // This should automatically get icons injected
    container.innerHTML = `
        <button class="sva-button">
            <span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>
            Add Item
        </button>
    `;
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Icons Not Appearing

**Symptoms**: HTML shows `data-sva-icon` attributes but no SVG content

**Solutions**:
1. Ensure `initializeClassBasedIcons()` is called before rendering
2. Check that required bundles are registered
3. Verify icon names exist in the registered bundles

```javascript
// Debug: Check registration status
const result = await initializeClassBasedIcons({...});
console.log('Registration result:', result);
```

### Issue 2: Dynamic Content Not Working

**Symptoms**: Dynamically added icons don't appear

**Solutions**:
1. Ensure `enableObserver: true` is set
2. Verify MutationObserver is supported (IE11+)

```javascript
// Debug: Test observer
if (!window.MutationObserver) {
    console.error('MutationObserver not supported');
}
```

### Issue 3: CSS Class Conflicts

**Symptoms**: Styling broken after migration

**Solutions**:
1. Remove `sva-icon-{name}` from CSS selectors
2. Update CSS to target only sizing classes

```css
/* OLD - Don't target content classes */
.sva-icon-plus { color: green; }

/* NEW - Target size or semantic classes */
.sva-icon--s { width: 16px; height: 16px; }
.success-icon { color: green; }
```

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Update SVA Icons to v3.1.1+
- [ ] Review current icon usage patterns
- [ ] Identify all components using icons
- [ ] Plan testing strategy

### During Migration
- [ ] Update base icon component
- [ ] Migrate button components
- [ ] Migrate input components
- [ ] Migrate navigation components
- [ ] Update CSS classes (remove `sva-icon-{name}` selectors)
- [ ] Add initialization code to app entry point

### Post-Migration
- [ ] Visual testing across all components
- [ ] Performance testing
- [ ] Dynamic content testing
- [ ] Cross-browser validation
- [ ] Documentation updates

### Performance Targets
- [ ] Icon initialization: < 50ms
- [ ] DOM scanning: < 10ms per 100 elements
- [ ] No CSS class conflicts
- [ ] Clean HTML structure

---

## 🔗 Additional Resources

- **SVA Icons Documentation**: `/USAGE.md`
- **Visual Testing App**: `/visual-testing/` 
- **Bundle Reference**: Check `BUNDLE_MAPPINGS` in auto-register.js
- **Browser Support**: IE11+, Chrome, Firefox, Safari, Edge

---

## 💬 Support

For migration support and questions:

1. **Check the visual testing app** for working examples
2. **Review USAGE.md** for comprehensive documentation  
3. **Test with the browser example** in `.tests/browser/`
4. **Contact SVA Icons team** for technical assistance

---

**Migration completed?** ✅ Your SVA Framework now has clean separation between styling and content with zero CSS class conflicts!
