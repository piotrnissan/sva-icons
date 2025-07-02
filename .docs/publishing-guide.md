# SVA Icons Publishing Guide

## Quick Publish Workflow

### 1. Add New Icons
```powershell
# Add SVG files to /svg folder
# Example: add "new-feature.svg"
```

### 2. Build Everything
```powershell
npm run build:all
```

### 3. Version and Publish
```powershell
# Option A: Patch version (3.0.0 → 3.0.1)
npm version patch ; npm publish

# Option B: Minor version (3.0.0 → 3.1.0) 
npm version minor ; npm publish

# Option C: Major version (3.0.0 → 4.0.0)
npm version major ; npm publish

# Option D: Just publish (keeps current version)
npm publish
```

### 4. Visual Testing Updates Automatically! 🎉

## Publishing Checklist

### Before Publishing:
- [ ] New icons added to `/svg` folder
- [ ] Icons validated: `npm run validate-icons`
- [ ] Icons optimized: SVGs are clean and optimized
- [ ] Build successful: `npm run build:all` 
- [ ] Version bumped appropriately: `npm version [patch|minor|major]`

### What Gets Published:
- [ ] `/dist` folder (built icons, components, etc.)
- [ ] `/svg` folder (source SVGs) 
- [ ] `icons.json` (icon metadata)
- [ ] `package.json`, `README.md`, `USAGE.md`, etc.

### After Publishing:
- [ ] Check npm registry: `https://www.npmjs.com/package/sva-icons`
- [ ] Verify CDN availability: `https://unpkg.com/sva-icons@latest/`
- [ ] Monitor GitHub Actions: Repository → Actions tab
- [ ] Check Vercel deployments: Vercel dashboard
- [ ] Test visual testing app: Should show new icons in ~3 minutes

## Version Strategy

### Semantic Versioning:
- **Patch (3.0.0 → 3.0.1)**: New icons, bug fixes
- **Minor (3.0.0 → 3.1.0)**: New features, API additions  
- **Major (3.0.0 → 4.0.0)**: Breaking changes, API changes

### Recommended Versioning:
```powershell
# Adding new icons → patch
npm version patch

# Adding new bundles/features → minor  
npm version minor

# Changing icon names/API → major
npm version major
```

## Troubleshooting

### If Visual Testing Doesn't Update:
1. **Check GitHub Actions**: Repository → Actions → Latest workflow
2. **Check Vercel Deployments**: Vercel dashboard → Deployments  
3. **Check Environment Variables**: Verify VERCEL_BUILD_HOOK_URL is set
4. **Manual Trigger**: Run `node scripts/trigger-visual-testing.js`

### If NPM Publish Fails:
```powershell
# Check if you're logged in
npm whoami

# Login if needed
npm login

# Check package.json version
npm version --no-git-tag-version patch

# Try dry run first
npm publish --dry-run
```

### If Icons Don't Show in CDN:
- Wait 1-2 minutes for CDN propagation
- Check: `https://unpkg.com/sva-icons@latest/icons.json`
- Force refresh: `https://unpkg.com/sva-icons@latest/icons.json?t=123456`

## Advanced Publishing

### Beta/Alpha Releases:
```powershell
# Publish beta version
npm version prerelease --preid=beta
npm publish --tag beta

# Users install with: npm install sva-icons@beta
```

### Private Testing:
```powershell
# Test locally before publishing
npm pack
# Creates sva-icons-3.0.1.tgz

# Install the package locally in another project
npm install /path/to/sva-icons-3.0.1.tgz
```

### Automated Publishing (CI/CD):
```yaml
# .github/workflows/publish.yml
name: Publish Package
on:
  push:
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build:all
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

**Quick Command Reference:**
```powershell
npm run build:all          # Build everything
npm version patch          # Bump version  
npm publish               # Publish to npm + trigger visual testing
npm publish --dry-run     # Test publish
npm whoami               # Check login status
```
