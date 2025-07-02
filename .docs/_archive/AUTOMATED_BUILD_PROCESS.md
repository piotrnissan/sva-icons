# SVA Icons - Automated Build Process

## 🎯 **Automation Overview**

The build process is now fully automated to prevent sync issues between different icon output formats.

## 📋 **Automated Scripts**

### **New: `build:icons-browser`**
```powershell
npm run build:icons-browser
```

**Purpose:** Automatically generates `src/icons-browser.js` from the `svg/` folder

**Features:**
- ✅ Reads all SVG files from `svg/` folder
- ✅ Converts filenames to camelCase (kebab-case → camelCase)
- ✅ Cleans and validates SVG content
- ✅ Generates ES module exports
- ✅ Creates icon registry mapping
- ✅ Adds helper functions (getIcon, hasIcon, getIconCount, etc.)
- ✅ Excludes processed/ and icons-to-update/ folders
- ✅ Auto-generated file with timestamp

### **Updated: `build:class-based`**
```powershell
npm run build:class-based
```

**New Flow:** `npm run build:icons-browser && node scripts/build-class-based.js`

**Result:** Class-based API is always in sync with the `svg/` folder

## 🔄 **Complete Build Flow**

### **Individual Builds (All Auto-Sync with svg/):**
```powershell
npm run build:icons           # Function-based icons
npm run build:icons-browser   # Browser registry (NEW)
npm run build:react           # React components  
npm run build:web             # Web components
npm run build:sprite          # SVG sprite
npm run build:class-based     # Class-based API (includes icons-browser)
npm run build:css             # CSS classes
```

### **Complete Build:**
```powershell
npm run build:all             # Builds everything in correct order
```

## 📂 **Data Flow Diagram**

```
svg/ folder (Source of Truth)
├─ build:icons → dist/icons/ (Function-based)
├─ build:react → dist/react/ (React components)
├─ build:web → dist/web-components/ (Web components)
├─ build:sprite → dist/sprite/ (SVG sprite)
└─ build:icons-browser → src/icons-browser.js → build:class-based → dist/class-based/
```

## ✅ **Problem Solved**

### **Before (Manual Sync):**
```
svg/car.svg (✅ fixed) ❌ Not connected to
src/icons-browser.js (❌ manual, outdated) → Class-based API
```

### **After (Automated):**
```
svg/car.svg (✅ fixed) → build:icons-browser → src/icons-browser.js (✅ auto) → Class-based API
```

## 🎯 **Benefits**

1. **No More Manual Sync:** Icons-browser.js is always current
2. **Consistent Naming:** Automatic kebab-case → camelCase conversion
3. **Error Prevention:** Validation and cleaning of SVG content
4. **Comprehensive Info:** Auto-generated timestamp and metadata
5. **Future-Proof:** Adding new SVGs automatically includes them

## 📝 **Example Output**

When you add `arrow-left.svg` to the `svg/` folder:

**Auto-Generated in `src/icons-browser.js`:**
```javascript
export const arrowLeft = `<svg viewBox="0 0 24 24">...</svg>`;

export const iconRegistry = {
  'arrow-left': () => arrowLeft,
  // ... other icons
};
```

## 🚀 **Usage**

### **After Adding New Icons:**
```powershell
# Add SVG files to svg/ folder
# Then run:
npm run build:all
# All formats will be automatically updated and synchronized
```

### **Daily Development:**
```powershell
# For icon changes:
npm run build:icons-browser  # Just update browser registry
npm run build:class-based    # Includes icons-browser + builds class-based

# For complete rebuild:
npm run build:all            # Everything in sync
```

## 📊 **Verification**

All icon formats now consistently support proper color theming:
- ✅ Function-based icons (`dist/icons/`)
- ✅ React components (`dist/react/`)
- ✅ Web components (`dist/web-components/`)
- ✅ SVG sprite (`dist/sprite/`)
- ✅ Class-based API (`dist/class-based/`)

**Date:** June 30, 2025  
**Status:** ✅ FULLY AUTOMATED - No manual sync required
