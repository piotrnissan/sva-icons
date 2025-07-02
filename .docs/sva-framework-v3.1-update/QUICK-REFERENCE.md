# SVA Icons v3.1.0 - Quick Reference for SVA Framework Team

## 🚀 TL;DR - Get Started in 2 Minutes

### **1. Install**
```bash
npm install sva-icons@^3.1.0
```

### **2. Initialize (do this once in your app)**
```javascript
import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

await initializeClassBasedIcons({
  registerBundles: ['ui-essentials', 'automotive-core'],
  scanDOM: true,
  enableObserver: true
});
```

### **3. Use Icons**
```html
<div class="sva-icon-plus"></div>
<span class="sva-icon-car"></span>
<button class="sva-icon-settings"></button>
```

### **4. Done!** 
Icons automatically inject as SVG elements. No manual registration needed.

---

## 📦 Available Bundles

| Bundle | Icons | Use Case |
|--------|-------|----------|
| `ui-essentials` | plus, minus, settings, cross, tick, search, filter, edit | Common UI interactions |
| `automotive-core` | car, battery, charging, alert, speed, fuel-type, engine-power | Vehicle-related features |
| `navigation` | arrow-up, arrow-down, arrow-left, arrow-right, directions, map-view | Navigation/movement |
| `communication` | phone, email, chat, message, contact-phone, contact-email | Communication features |
| `media` | play, pause, volume, camera, video, gallery | Media controls |
| `commerce` | price, payment, calculator-1, offers, trade-in | E-commerce features |

---

## 🎯 Common Integration Patterns

### **React/Next.js**
```jsx
// App.jsx or _app.js
useEffect(() => {
  initializeClassBasedIcons({
    registerBundles: ['ui-essentials', 'automotive-core'],
    scanDOM: true,
    enableObserver: true
  });
}, []);
```

### **Vue.js/Nuxt**
```vue
<script>
export default {
  async mounted() {
    await initializeClassBasedIcons({
      registerBundles: ['ui-essentials', 'automotive-core'],
      scanDOM: true
    });
  }
}
</script>
```

### **Angular**
```typescript
// app.component.ts
async ngOnInit() {
  await initializeClassBasedIcons({
    registerBundles: ['ui-essentials', 'automotive-core'],
    scanDOM: true
  });
}
```

---

## 🎨 CSS Examples

### **Sizing**
```css
.sva-icon-plus { width: 24px; height: 24px; }

/* Or use size classes */
.sva-icon-s  { width: 16px; height: 16px; }
.sva-icon-m  { width: 24px; height: 24px; }
.sva-icon-l  { width: 32px; height: 32px; }
```

### **Coloring**
```css
.sva-icon-car { color: #007bff; }
.my-button { color: red; } /* Icons inherit parent color */
```

---

## 🔧 Configuration Options

```javascript
await initializeClassBasedIcons({
  // Choose your strategy:
  registerBundles: ['ui-essentials'],     // Pre-load common icons
  scanDOM: true,                          // Auto-detect from HTML classes
  autoRegister: ['specific', 'icons'],    // Manual list (rarely needed)
  
  // Behavior:
  prefix: 'sva-icon-',      // CSS class prefix (default)
  enableObserver: true,     // Watch for dynamic content (recommended)
  scope: document           // Where to scan (default: entire document)
});
```

---

## 🚨 Troubleshooting

### **Icons not showing?**

1. **Check import path:**
   ```javascript
   // ✅ Correct
   import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';
   
   // ❌ Wrong
   import { initializeClassBasedIcons } from 'sva-icons/class-based';
   ```

2. **Check CSS class prefix:**
   ```html
   <!-- ✅ Correct -->
   <div class="sva-icon-plus"></div>
   
   <!-- ❌ Wrong -->
   <div class="icon-plus"></div>
   ```

3. **Check bundle name:**
   ```javascript
   // ✅ Correct
   registerBundles: ['ui-essentials']
   
   // ❌ Wrong  
   registerBundles: ['ui']
   ```

### **Browser import errors?**

Add import map:
```html
<script type="importmap">
{
  "imports": {
    "sva-icons/class-based/auto-register": "./node_modules/sva-icons/dist/class-based/esm/auto-register.js"
  }
}
</script>
```

---

## 📊 Performance Tips

- ✅ **Use bundles** for common icons
- ✅ **Enable DOM scanning** for edge cases  
- ✅ **Enable observer** for SPAs
- ❌ Don't register every icon individually
- ❌ Don't disable observer in dynamic apps

---

## 🎯 Migration from v3.0.x

**Good news: No breaking changes!** 

Your existing code continues to work. The class-based system is purely additive.

```javascript
// Old way (still works)
import { Plus } from 'sva-icons';
document.getElementById('btn').innerHTML = Plus();

// New way (recommended)
// <button id="btn" class="sva-icon-plus"></button>
await initializeClassBasedIcons({ scanDOM: true });
```

---

## 📞 Need Help?

- **Full Documentation**: [CLASS-BASED-INTEGRATION-GUIDE.md](./CLASS-BASED-INTEGRATION-GUIDE.md)
- **Live Examples**: Check `.tests/browser/` directory
- **Online Demo**: https://sva-icons.vercel.app

---

**Ready to integrate? Start with the basic pattern above and expand from there! 🚀**
