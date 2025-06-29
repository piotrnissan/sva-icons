# 🚀 SVA Icons - Quick Reference

## **Daily Usage**

```bash
# 1. Add SVG files to staging
# Drop files in: svg/icons-to-update/

# 2. Process all icons
npm run update-icons

# 3. Done! 🎉
```

## **What Happens Automatically**

- ✅ **Normalizes** filenames (`wds2-icon-battery.svg` → `battery.svg`)
- ✅ **Cleans** SVG content (removes fills, strokes, styles)
- ✅ **Checks** for duplicates (name and content)
- ✅ **Moves** processed icons to `svg/` directory
- ✅ **Backs up** originals to `svg/processed/`
- ✅ **Rebuilds** all systems (class-based, CSS, etc.)
- ✅ **Reports** detailed results

## **Command Options**

```bash
npm run update-icons           # Process all icons
npm run update-icons -- --help # Show help
```

## **Expected Output**

```
🚀 Starting SVA Icons Update Process...
📁 Found 3 icon(s) to process
🔄 Processing: wds2-battery-low.svg
   📝 Normalized name: battery-low.svg
   ✅ Added to svg/battery-low.svg
🔨 Running build processes...
   ✅ build:icons completed (1524ms)
   ✅ build:class-based completed (1070ms)
   ✅ build:css completed (965ms)
✅ Icon update process completed!
📝 New icons added: battery-low.svg
```

## **File Locations**

| Purpose | Location |
|---------|----------|
| **Add new icons** | `svg/icons-to-update/` |
| **Final icons** | `svg/` |
| **Backup originals** | `svg/processed/` |
| **Process report** | `icon-update-report.json` |

## **Duplicate Detection**

| Type | Example | Action |
|------|---------|--------|
| **Name** | `battery.svg` already exists | Skip, warn |
| **Content** | Identical SVG paths | Skip, warn |

## **File Naming**

Input files can be **any format**:
- `Battery Low.svg` ✅
- `wds2-icon-battery-low.svg` ✅  
- `Arrow-Right.svg` ✅
- `SETTINGS_GEAR.SVG` ✅

All become: `battery-low.svg`, `arrow-right.svg`, etc.

## **Troubleshooting**

| Issue | Solution |
|-------|----------|
| **No icons found** | Add `.svg` files to `svg/icons-to-update/` |
| **Build failed** | Check Node.js version, run `npm install` |
| **Permission error** | Run as administrator or check file permissions |

## **Need Help?**

- 📖 **Detailed docs**: `.docs/PROCESS_COMPLETE.md`
- 🛠 **Source code**: `scripts/update-icons.js`
- 📊 **Last report**: `icon-update-report.json`
