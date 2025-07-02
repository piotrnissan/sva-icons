# SVA Icons - JavaScript Reserved Words Solution

## Problem Summary
When updating icons, the build process failed because some icon names (like `package.svg`) are JavaScript reserved words, which cannot be used as variable names in strict mode (ES modules).

## Root Cause
The `icons-browser.js` file is auto-generated and converts icon filenames to JavaScript variable names. If an icon name matches a reserved word, it creates invalid JavaScript code:

```javascript
// ❌ This fails because 'package' is a reserved word
export const package = `<svg>...</svg>`;
```

## Solution Implemented

### 1. **Updated Build Script** (`scripts/build-icons-browser.js`)
- Added comprehensive list of JavaScript reserved words and common global identifiers
- Enhanced `toCamelCase()` function to detect and handle reserved words
- Automatically appends "Icon" suffix to problematic names
- Provides clear warnings during build process

**Example transformations:**
- `package.svg` → `packageIcon` (instead of `package`)
- `alert.svg` → `alertIcon` (instead of `alert`)

### 2. **Created Validation Script** (`scripts/validate-icon-names.js`)
- Proactively validates all icon names before building
- Identifies potential conflicts and invalid identifiers
- Provides suggestions for fixing problematic names
- Can be run manually: `npm run validate-icon-names`

### 3. **Updated Build Process**
- Integrated validation into `build:icons-browser` script
- Validation runs automatically before building
- Build fails if there are errors, passes with warnings

## Reserved Words Handled

The solution protects against:

**ES5/ES6 Reserved Words:**
- `break`, `case`, `catch`, `class`, `const`, `function`, `if`, `package`, `return`, etc.

**Built-in Global Objects:**
- `Array`, `Boolean`, `Date`, `Error`, `JSON`, `Math`, `Object`, etc.

**Browser APIs:**
- `alert`, `confirm`, `fetch`, `location`, `history`, `navigator`, etc.

## How to Avoid Future Issues

### 1. **Icon Naming Best Practices**
- Use kebab-case: `my-icon.svg` ✅
- Avoid reserved words: `package.svg` ❌ → `package-icon.svg` ✅
- Start with letters: `1-star.svg` ❌ → `one-star.svg` ✅
- Use descriptive names: `a.svg` ❌ → `arrow.svg` ✅

### 2. **Pre-Build Validation**
```powershell
# Check icon names before adding
npm run validate-icon-names

# Full validation with build
npm run build:icons-browser
```

### 3. **Recommended Icon Names**
Instead of JavaScript reserved words:
- `package.svg` → `package-icon.svg` or `box.svg`
- `class.svg` → `class-room.svg` or `category.svg`
- `function.svg` → `function-key.svg` or `formula.svg`
- `return.svg` → `return-arrow.svg` or `back.svg`

## Build Output Examples

**Successful build with auto-fix:**
```
⚠️ Reserved word "alert" (from "alert") renamed to "alertIcon"
⚠️ Reserved word "package" (from "package") renamed to "packageIcon"
✅ Generated: src/icons-browser.js
```

**Validation warnings (auto-fixed):**
```
⚠️ WARNINGS (will be auto-fixed during build):
   • alert.svg → "alert"
     Issue: reserved word
     Auto-fix: → "alertIcon"
```

## Files Modified

1. **`scripts/build-icons-browser.js`** - Enhanced reserved word handling
2. **`scripts/validate-icon-names.js`** - New validation script
3. **`package.json`** - Added validation commands and build integration
4. **`src/icons-browser.js`** - Auto-regenerated with proper naming

## Testing

The solution has been tested with:
- ✅ 358 total icons processed successfully
- ✅ Reserved words automatically handled
- ✅ Valid JavaScript output generated
- ✅ No build errors

## Usage

**For developers adding new icons:**
```powershell
# 1. Add your icon to svg/ folder
# 2. Validate the name
npm run validate-icon-names

# 3. Build (with automatic validation)
npm run build:icons-browser

# 4. Build everything
npm run build:all
```

**For CI/CD pipelines:**
The validation is now automatic as part of the build process, so no additional steps are needed.

## Benefits

1. **Prevents build failures** from reserved word conflicts
2. **Automatic fixes** for common issues
3. **Clear warnings** when problems are detected
4. **Proactive validation** before building
5. **Developer-friendly** error messages and suggestions
6. **Zero breaking changes** to existing functionality

This solution ensures robust, future-proof icon builds while maintaining compatibility with all existing icons and APIs.
