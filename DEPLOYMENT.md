# Documentation Deployment Guide

This guide covers different options for deploying the SVA Icons documentation site.

## Quick Start

### Local Development
```bash
# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Deployment Options

✅ **Currently deployed at: [https://sva-icons.vercel.app](https://sva-icons.vercel.app)**

### 1. Vercel (✅ DEPLOYED)

**Live at:** [https://sva-icons.vercel.app](https://sva-icons.vercel.app)

**Benefits:**
- ✅ Automatic deployments from GitHub
- ✅ Fast global CDN
- ✅ Perfect React/Vite integration
- ✅ Custom domains with SSL
- ✅ Preview deployments for PRs

**To update:** Just push to your GitHub repository - Vercel will auto-deploy!

### 2. GitHub Pages (Alternative Option)

### 2. GitHub Pages (Alternative Option)

**Prerequisites:**
- Repository must be on GitHub
- GitHub Pages enabled in repository settings

**Deploy:**
```bash
npm run docs:deploy
```

### 3. Netlify (Alternative Option)

**Option A - Git Integration (Recommended):**
1. Go to [netlify.com](https://netlify.com) and sign up
2. Connect your GitHub repository
3. Netlify will automatically detect the `netlify.toml` configuration
4. Deploy!

**Option B - Manual Upload:**
1. Build the docs: `npm run docs:build`
2. Drag and drop the `docs/dist` folder to Netlify

**Configuration is already included in `netlify.toml`**

### 4. NPM Package Documentation

Since your package is on NPM, you can link to the documentation:

1. Update your NPM package: `npm version patch && npm publish`
2. The `homepage` field in `package.json` will link to your docs
3. Users will see the documentation link on npmjs.com

### 5. Custom Server

**Build and serve:**
```bash
npm run docs:build
cd docs/dist
# Serve with any static file server
npx serve .
# Or with Python
python -m http.server 8000
```

## Configuration Files

### GitHub Pages
- Script: `scripts/deploy-docs.js`
- Package script: `npm run docs:deploy`

### Vercel
- Config: `vercel.json`
- Auto-detected as Vite project

### Netlify
- Config: `netlify.toml`
- Includes redirects and caching headers

## Custom Domain Setup

### GitHub Pages
1. Add a `CNAME` file in `docs/public/` with your domain
2. Configure DNS to point to GitHub Pages
3. Enable custom domain in repository settings

### Vercel/Netlify
1. Add domain in platform settings
2. Update DNS records as instructed
3. SSL is automatically provided

## Environment Variables

For different deployment environments, you can set:

```bash
# In your CI/CD or platform settings
VITE_BASE_URL=/sva-icons/  # For GitHub Pages
VITE_API_URL=https://your-api.com  # If you have an API
```

## Troubleshooting

### Common Issues:

1. **404 on refresh:** Make sure your platform supports SPA routing
   - GitHub Pages: Add `.nojekyll` file
   - Netlify: Uses redirects in `netlify.toml`
   - Vercel: Auto-handled

2. **Asset paths wrong:** Check the base URL in `vite.config.js`

3. **Build fails:** Ensure Node.js version compatibility (≥16.0.0)

### Getting Help

- Check the platform-specific documentation
- Verify all dependencies are installed
- Test locally with `npm run docs:preview` first

## Recommended Approach

For most use cases, we recommend **Vercel** because:
- ✅ Automatic deployments
- ✅ Fast global CDN
- ✅ Perfect React/Vite integration
- ✅ Custom domains with SSL
- ✅ Preview deployments for PRs
- ✅ Generous free tier

## Next Steps

1. Choose your deployment platform
2. Follow the setup steps above
3. Update the `homepage` URL in `package.json`
4. Share your documentation URL!
