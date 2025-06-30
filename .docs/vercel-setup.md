# Vercel Auto-Deploy Setup for Visual Testing

## Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import the `visual-testing` folder (or create separate repo)
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## Step 2: Get Build Hook URL

1. In Vercel project → Settings → Git
2. Scroll to "Deploy Hooks"
3. Create new hook: 
   - **Hook Name**: "Icon Updates"
   - **Git Branch**: `main`
4. Copy the hook URL

✅ **Current Hook URL**: `https://api.vercel.com/v1/integrations/deploy/prj_d9XCmB6jEooHVyJfP77UVwpgzAit/Kn27FGyWSX`

## Step 3: Add Hook to sva-icons

### Option A: Package.json Script
```json
{
  "scripts": {
    "postpublish": "curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_d9XCmB6jEooHVyJfP77UVwpgzAit/Kn27FGyWSX"
  }
}
```

### Option B: GitHub Actions (Recommended)
```yaml
# .github/workflows/update-visual-testing.yml
name: Update Visual Testing on Release
on:
  release:
    types: [published]

jobs:
  trigger-visual-testing:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy
        run: |
          curl -X POST "${{ secrets.VERCEL_VISUAL_TESTING_HOOK }}"
```

## Step 4: Environment Variables & Secrets

### In your main sva-icons repository, add GitHub Secrets:
1. Go to repository → Settings → Secrets and variables → Actions
2. Add these secrets:

```
VERCEL_VISUAL_TESTING_HOOK=https://api.vercel.com/v1/integrations/deploy/prj_d9XCmB6jEooHVyJfP77UVwpgzAit/Kn27FGyWSX
VISUAL_TESTING_WEBHOOK_URL=https://your-visual-testing.vercel.app/api/webhook
VISUAL_TESTING_WEBHOOK_SECRET=your-secret-key-here
```

### In Vercel project settings, add Environment Variables:
```
VITE_SVA_ICONS_VERSION=3.0.0
VITE_API_BASE_URL=https://unpkg.com/sva-icons
VITE_GITHUB_RAW_URL=https://raw.githubusercontent.com/your-org/sva-icons/main
VITE_ENABLE_DYNAMIC_LOADING=true
WEBHOOK_SECRET=your-secret-key-here
VERCEL_BUILD_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/prj_d9XCmB6jEooHVyJfP77UVwpgzAit/Kn27FGyWSX
```

### In your local environment (for testing):
```bash
export VERCEL_BUILD_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/prj_d9XCmB6jEooHVyJfP77UVwpgzAit/Kn27FGyWSX"
export VISUAL_TESTING_WEBHOOK_URL="https://your-visual-testing.vercel.app/api/webhook"
export VISUAL_TESTING_WEBHOOK_SECRET="your-secret-key-here"
export ENABLE_VISUAL_TESTING_TRIGGER="true"
```

## Step 6: NPM Publishing Integration

### How It Works:
The visual testing auto-update is **triggered by npm publishing**:

```
npm publish → postpublish script → webhook/GitHub Actions → Vercel rebuild
```

### Publishing Workflow:
```powershell
# 1. Add new icons to /svg folder
# 2. Build everything
npm run build:all

# 3. Version bump (optional)
npm version patch   # 3.0.0 → 3.0.1
# or
npm version minor   # 3.0.0 → 3.1.0  
# or
npm version major   # 3.0.0 → 4.0.0

# 4. Publish to npm (this triggers the auto-deploy!)
npm publish

# 5. Visual testing updates automatically! 🎉
```

### What Happens When You Publish:
1. **Package goes to npm registry** → Available at `https://unpkg.com/sva-icons@latest`
2. **postpublish script runs** → `scripts/trigger-visual-testing.js` 
3. **GitHub Actions triggers** → `.github/workflows/update-visual-testing.yml`
4. **Vercel rebuilds** → Visual testing app updates
5. **CDN updates** → Dynamic loading gets latest version instantly

### Publishing Options:

#### A. Regular Publish (Recommended)
```powershell
# Build and publish in one go
npm run clean-build ; npm publish
```

#### B. Version + Publish
```powershell
# Bump version and publish
npm version patch ; npm publish
```

#### C. Publish with Tag
```powershell
# Publish beta/alpha versions
npm publish --tag beta
npm publish --tag alpha
```

#### D. Dry Run (Test Only)
```powershell
# Test what would be published
npm publish --dry-run
```

### NPM Registry Benefits:
- **Global CDN** → Fast icon loading worldwide
- **Version Management** → Users can pin to specific versions  
- **Automatic Updates** → Visual testing always shows latest
- **Fallback Strategy** → If CDN fails, uses built package

## Step 7: Test the Setup

### Manual Test:
```powershell
# Test the trigger script
$env:VISUAL_TESTING_WEBHOOK_URL = "https://your-visual-testing.vercel.app/api/webhook"
$env:VISUAL_TESTING_WEBHOOK_SECRET = "your-secret-key"
node scripts/trigger-visual-testing.js
```

### Full Test:
1. Add a new icon to `/svg` folder
2. Run: `npm run build:all`
3. Run: `npm publish` (or `npm version patch; npm publish`)
4. Check GitHub Actions tab for workflow execution
5. Check Vercel deployments for rebuild
6. Visit visual testing app to see new icon

## Result

✅ **When you add new icons:**
1. Add SVG files to `/svg` folder
2. Run `npm run build` (updates icons.json)
3. Run `npm publish`
4. **→ Visual testing automatically rebuilds and deploys**
5. **→ New icons appear in 2-3 minutes**

✅ **For immediate updates:**
- Dynamic loading shows new icons instantly
- Build hook ensures fast static loading for future visits
