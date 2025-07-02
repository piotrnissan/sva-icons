# SVG Naming Convention and Process Guide

## Overview
This document establishes the official naming convention and process for adding/updating SVG icons in the SVA Icons system. Following these conventions ensures consistent behavior across all platforms and prevents naming conflicts.

## SVG File Naming Convention

### Rules
1. **Use only lowercase letters, numbers, and underscores**
   - ✅ Good: `battery_low.svg`, `arrow_left.svg`, `user_profile.svg`
   - ❌ Bad: `Battery-Low.svg`, `arrow left.svg`, `user@profile.svg`

2. **Use underscores (_) to separate words**
   - ✅ Good: `service_booking.svg`, `fuel_type_ev.svg`
   - ❌ Bad: `service-booking.svg`, `servicebooking.svg`, `service booking.svg`

3. **Be descriptive but concise**
   - ✅ Good: `battery_charging.svg`, `star_filled.svg`
   - ❌ Bad: `b.svg`, `battery_charging_indicator_with_progress.svg`

4. **Use consistent terminology**
   - Use `_filled` for solid/filled variants
   - Use `_outline` for outline/stroke variants  
   - Use `_small`, `_large` for size variants
   - Use `_alert` for warning/alert variants
   - Use `_active`, `_inactive` for state variants

### Examples of Good Names
```
car.svg
battery.svg
battery_low.svg
battery_charging.svg
battery_full.svg
arrow_left.svg
arrow_right.svg
arrow_up.svg
arrow_down.svg
star_filled.svg
star_outline.svg
user_profile.svg
settings_gear.svg
search_magnifier.svg
home_house.svg
notification_bell.svg
notification_bell_filled.svg
```

## File-to-Code Mapping

The naming convention ensures predictable conversion to different code formats:

| SVG Filename | CSS Class | JavaScript Function | JavaScript File |
|--------------|-----------|-------------------|-----------------|
| `car.svg` | `sva-icon-car` | `Car` | `car.js` |
| `battery_low.svg` | `sva-icon-battery-low` | `BatteryLow` | `battery_low.js` |
| `arrow_left.svg` | `sva-icon-arrow-left` | `ArrowLeft` | `arrow_left.js` |
| `star_filled.svg` | `sva-icon-star-filled` | `StarFilled` | `star_filled.js` |

### Conversion Logic
1. **CSS Class**: `sva-icon-` + filename (without .svg) with underscores replaced by hyphens
2. **JavaScript Function**: PascalCase version of filename (without .svg)
3. **JavaScript File**: Same as SVG filename but with .js extension

## Process for Adding New Icons

### 1. Prepare the SVG File
- Ensure the SVG is optimized (use SVGO or similar)
- Remove any unnecessary metadata, comments, or styling
- Ensure the SVG uses a consistent viewBox (preferably 24x24 or 16x16)
- Name the file according to the naming convention above

### 2. Add to svg/ Directory
```powershell
# Copy your properly named SVG file to the svg/ directory
Copy-Item "path\to\your\new_icon.svg" "svg\"
```

### 3. Build the Icon System
```powershell
# Run the build process to generate all necessary files
npm run build:icons
npm run build:class-based
npm run build:css
```

### 4. Test the Icon
```powershell
# Test the new icon using the test page
# Open test-comprehensive-icons.html in Live Preview
# Search for your new icon name to verify it loads correctly
```

### 5. Verify Generated Files
Check that the following files were created correctly:
- `dist/icons/esm/new_icon.js`
- `dist/icons/cjs/new_icon.js`
- CSS class `sva-icon-new-icon` in generated CSS files
- Icon appears in `icons.json`

## Quality Checklist

Before adding an icon, ensure:
- [ ] SVG filename follows naming convention (lowercase, underscores only)
- [ ] SVG is optimized and clean
- [ ] SVG has consistent viewBox
- [ ] Icon has a clear, descriptive name
- [ ] Name doesn't conflict with existing icons
- [ ] Icon builds successfully without errors
- [ ] Icon appears correctly in test page
- [ ] CSS class and JavaScript function are generated correctly

## Common Mistakes to Avoid

1. **Spaces in filenames** → Causes build errors
2. **Hyphens in filenames** → Inconsistent with JavaScript naming
3. **Mixed case** → Causes confusion in different systems
4. **Special characters** → Can break file systems or imports
5. **Too generic names** → May conflict with future icons
6. **Too specific names** → Makes the icon less reusable

## Reserved/Common Naming Patterns

Use these consistent patterns for common icon types:

### Directional
- `arrow_left`, `arrow_right`, `arrow_up`, `arrow_down`
- `chevron_left`, `chevron_right`, `chevron_up`, `chevron_down`

### States
- `{name}_filled`, `{name}_outline`
- `{name}_active`, `{name}_inactive`
- `{name}_enabled`, `{name}_disabled`

### Sizes
- `{name}_small`, `{name}_large`
- `{name}_mini`, `{name}_xl`

### Alerts/Status
- `{name}_alert`, `{name}_warning`, `{name}_error`, `{name}_success`
- `{name}_info`, `{name}_help`

## Migration Notes

When migrating existing icons:
1. List all current problematic filenames
2. Determine correct names according to convention
3. Rename files systematically
4. Rebuild entire icon system
5. Update any hardcoded references in documentation or examples

This process ensures a clean, maintainable icon system that scales effectively.
