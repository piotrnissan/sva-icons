# SVA Icons Documentation Site

This is the documentation site for SVA Icons v2.0, built with React and Vite. It showcases the enhanced features, provides usage examples, and includes an interactive icon explorer.

## Features

- **Icon Explorer**: Browse and search through all available icons
- **Usage Examples**: Comprehensive examples for all integration methods
- **v2.0 Features**: Detailed overview of new v2.0 capabilities including:
  - Smart Bundle System
  - Enhanced React Icon Component
  - CSS Theme System
  - JavaScript Theme API
  - Bundle Analyzer
  - Developer Tools

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## Project Structure

```
docs/
├── src/
│   ├── components/
│   │   ├── IconExplorer.jsx    # Interactive icon browser
│   │   ├── UsageExamples.jsx   # Code examples and documentation
│   │   ├── V2Features.jsx      # v2.0 feature showcase
│   │   └── icons/              # Icon component mappings
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles
│   └── main.jsx               # Application entry point
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## Documentation Content

The site includes comprehensive documentation for:

### Installation & Setup
- Package installation
- Import methods
- TypeScript support

### React Integration
- Individual icon components
- Enhanced Icon component with theme support
- Props and customization options

### Smart Bundles (v2.0)
- Bundle-based imports for optimized loading
- Available bundle categories
- Performance benefits

### Theme System (v2.0)
- CSS theme framework
- JavaScript theme API
- Custom theme configuration

### Developer Tools (v2.0)
- Bundle analyzer
- Development utilities
- Performance monitoring

### Migration Guide
- Upgrading from v1.x to v2.0
- Backward compatibility notes
- New feature adoption

## Deployment

The documentation site is configured for deployment to:
- **Netlify** (via `netlify.toml` in root)
- **Vercel** (via `vercel.json` in root)

The site builds to the `dist/` directory and can be served statically.
