# Browser Setup Guide for SVA Icons v3.1+
## Clean Import Support for Live Preview and Browser Development

**Target Audience**: Developers working in browser environments, VS Code Live Preview, and unbundled development setups.

---

## 🎯 **Quick Start**

### **Step 1: Install SVA Icons**
```powershell
npm install sva-icons
```

### **Step 2: Generate Import Map**
```powershell
# Using the new CLI tool
npx sva-icons generate-import-map --environment browser

# Or using npm script
npm run sva-icons:import-map
```

### **Step 3: Include Import Map in HTML**
```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include the generated import map -->
    <script type="importmap" src="./import-map.json"></script>
</head>
<body>
    <script type="module">
        // ✅ Clean imports now work!
        import { Plus, Minus, Settings } from 'sva-icons';
        
        // Render icons with no stroke (v3.1+ default)
        document.body.innerHTML = `
            <div>${Plus({ size: 24 })}</div>
            <div>${Minus({ size: 24 })}</div>
            <div>${Settings({ size: 24 })}</div>
        `;
    </script>
</body>
</html>
```

---

## 🖥️ **VS Code Live Preview Setup**

⚠️ **Important**: VS Code Live Preview **requires inline import maps**. External import map files (`src="./import-map.json"`) will not work.

### **Working Solution for Live Preview**
```html
<!DOCTYPE html>
<html>
<head>
    <!-- ✅ Use inline import map (this works in Live Preview) -->
    <script type="importmap">
    {
        "imports": {
            "sva-icons": "./node_modules/sva-icons/dist/icons/esm/index.js",
            "sva-icons/class-based": "./node_modules/sva-icons/dist/class-based/esm/index.js",
            "sva-icons/react": "./node_modules/sva-icons/dist/react/esm/index.js"
        }
    }
    </script>
</head>
<body>
    <script type="module">
        import { Plus, Car, Battery } from 'sva-icons';
        
        // All icons have strokeWidth: 0 by default (no stroke)
        const content = `
            <h1>SVA Icons in Live Preview</h1>
            ${Plus({ size: 32 })}
            ${Car({ size: 32 })}  
            ${Battery({ size: 32 })}
        `;
        
        document.body.innerHTML = content;
    </script>
</body>
</html>
```

### **❌ What Doesn't Work in Live Preview**
```html
<!-- ❌ External import map files fail in Live Preview -->
<script type="importmap" src="./import-map.json"></script>

<!-- ❌ This will cause "Failed to resolve module specifier" errors -->
```

---

## 🔧 **Advanced Configuration**

### **Custom Import Map Options**
```powershell
# Custom output location
npx sva-icons generate-import-map --output ./public/import-map.json

# Custom base path
npx sva-icons generate-import-map --base-path /static/node_modules/

# Different environments
npx sva-icons generate-import-map --environment vite
npx sva-icons generate-import-map --environment webpack
```

### **Bundle-Specific Imports**
```html
<script type="importmap">
{
    "imports": {
        "sva-icons": "./node_modules/sva-icons/dist/icons/esm/index.js",
        "sva-icons/automotive": "./node_modules/sva-icons/dist/bundles/automotive.js",
        "sva-icons/ui": "./node_modules/sva-icons/dist/bundles/core.js"
    }
}
</script>

<script type="module">
    // Import from specific bundles
    import { Car, Battery } from 'sva-icons/automotive';
    import { Plus, Minus } from 'sva-icons/ui';
</script>
```

---

## 🎨 **Visual Consistency (v3.1+ Changes)**

### **No Stroke by Default**
SVA Icons v3.1+ defaults to `strokeWidth: 0` (no stroke) to align with SVA design system:

```javascript
// ✅ v3.1+: No stroke by default
const icon = Plus({ size: 24 }); // strokeWidth: 0

// ✅ Explicit stroke if needed (rare)
const iconWithStroke = Plus({ size: 24, strokeWidth: 1 });
```

### **Before/After Comparison**
```javascript
// ❌ v3.0: Had stroke by default
const oldIcon = Plus({ size: 24 }); // strokeWidth: 1.5

// ✅ v3.1+: No stroke by default  
const newIcon = Plus({ size: 24 }); // strokeWidth: 0
```

---

## 🔧 **Class-Based Icons (Optional)**

### **Simple Setup**
```html
<script type="module">
    import { initializeClassBasedIcons } from 'sva-icons/class-based';
    
    // Auto-register common icons
    await initializeClassBasedIcons({
        autoRegister: ['plus', 'minus', 'settings', 'car', 'battery'],
        prefix: 'sva-icon-'
    });
</script>

<!-- Use in HTML -->
<div class="sva-icon-plus"></div>
<div class="sva-icon-car"></div>
```

### **Bundle Registration**
```javascript
// Register entire bundles
await initializeClassBasedIcons({
    registerBundles: ['automotive-core', 'ui-essentials'],
    prefix: 'sva-icon-'
});
```

---

## 🚨 **Troubleshooting**

### **"Module not found" Errors**
1. **Check import map path**: Ensure paths in import map are correct
2. **Use inline import map**: Live Preview requires inline instead of external files
3. **Verify file structure**: Ensure `node_modules/sva-icons/dist/` exists

### **Import Map Not Working in Live Preview**
```html
<!-- ❌ External file doesn't work in Live Preview -->
<script type="importmap" src="./import-map.json"></script>

<!-- ✅ Use inline import map instead -->
<script type="importmap">
{ 
  "imports": { 
    "sva-icons": "./node_modules/sva-icons/dist/icons/esm/index.js",
    "sva-icons/class-based": "./node_modules/sva-icons/dist/class-based/esm/index.js"
  } 
}
</script>
```

### **Individual Icon Imports Failing**
```javascript
// ❌ If individual imports fail, add them explicitly to import map
import { Plus } from 'sva-icons/icons/plus'; // Fails without explicit mapping

// ✅ Add to import map:
"sva-icons/icons/plus": "./node_modules/sva-icons/dist/icons/esm/plus.js"
```

### **Icons Have Unwanted Stroke**
```javascript
// ❌ If you see stroke, check version
console.log('SVA Icons version:', require('sva-icons/package.json').version);

// ✅ Should be v3.1+ for no stroke by default
const icon = Plus({ size: 24 }); // No strokeWidth needed
```

### **Performance Issues**
```javascript
// ✅ Import only what you need
import { Plus, Minus } from 'sva-icons';

// ❌ Avoid importing everything
import * as AllIcons from 'sva-icons'; // Don't do this
```

---

## ⚡ **Performance Tips**

### **Bundle Optimization**
- Use specific imports: `import { Plus } from 'sva-icons'`
- Consider bundle imports for related icons: `import { Car } from 'sva-icons/automotive'`
- Test load times in Live Preview environment

### **Memory Management**
- Class-based system uses < 1MB overhead
- Function-based icons have no memory overhead
- Icons are rendered as needed, not preloaded

---

## 📊 **Browser Support**

| **Browser** | **Version** | **Import Maps** | **ES Modules** |
|-------------|-------------|-----------------|----------------|
| Chrome      | 89+         | ✅             | ✅            |
| Firefox     | 88+         | ✅             | ✅            |
| Safari      | 14+         | ✅             | ✅            |
| Edge        | 89+         | ✅             | ✅            |

---

## 🔗 **Related Documentation**

- [Vite Setup Guide](.docs/vite-setup.md)
- [Webpack Setup Guide](.docs/webpack-setup.md)
- [Migration Guide](.docs/migration-v2-to-v3.md)
- [Troubleshooting Guide](.docs/troubleshooting.md)

---

## 📞 **Need Help?**

- **GitHub Issues**: Report setup problems
- **Documentation**: Check troubleshooting guide
- **VS Code Live Preview**: Use inline import maps

*This guide is part of SVA Icons v3.1+ enhancement for improved developer experience in browser environments.*
