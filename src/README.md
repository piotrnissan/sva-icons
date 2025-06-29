# SVA Icons Class-Based API - Getting Started

## 🎯 **Overview**

This directory contains the implementation files for the SVA Icons class-based API enhancement. This is a new feature that will be released in v2.2.0.

## 📁 **Project Structure**

```
src/
├── class-based/           # Core class-based API implementation
│   ├── scanner.js         # DOM scanning for icon classes
│   ├── injector.js        # SVG injection engine
│   ├── resolver.js        # Class name to icon function mapping
│   ├── observer.js        # Mutation observer for dynamic content
│   ├── performance.js     # Performance optimizations
│   ├── bundles.js         # Bundle system integration
│   ├── accessibility.js   # Accessibility enhancements
│   ├── types.ts           # TypeScript definitions
│   └── index.js           # Main initialization module
├── styles/                # CSS system with variables
│   ├── variables.css      # CSS variable definitions
│   ├── base.css           # Base icon styles
│   ├── sizes.css          # Size modifier classes
│   ├── colors.css         # Color modifier classes
│   ├── positions.css      # Position modifier classes
│   └── index.css          # Combined styles
└── README.md              # This file
```

## 🚀 **Next Steps**

1. **Review the Plan**: Check `CLASS_BASED_API_PLAN.md` for complete implementation plan
2. **Check the Tracker**: Use `CLASS_BASED_API_TRACKER.md` for detailed task tracking
3. **Start Development**: Begin with Phase 1 - Core Infrastructure

## 📝 **Development Guidelines**

### **Code Standards**
- Use ES6+ modules for all JavaScript files
- Include comprehensive JSDoc comments
- Add unit tests for all public functions
- Follow existing SVA Icons code style

### **File Naming**
- Use kebab-case for file names
- Use descriptive names that match functionality
- Include `.js` extension for JavaScript files
- Include `.css` extension for CSS files

### **Testing Requirements**
- Unit tests required for all core functions
- Integration tests for DOM manipulation
- Performance tests for critical paths
- Browser compatibility tests

### **Documentation Requirements**
- JSDoc comments for all public APIs
- README updates for new features
- Usage examples for complex features
- Performance notes for optimization features

## 🔧 **PowerShell Development Commands**

```powershell
# Navigate to project root
cd "c:\Users\wesolp\OneDrive - Nissan Motor Corporation\projects\sva-icons"

# Install dependencies (if needed)
npm install

# Run existing build (to ensure project works)
npm run build:all

# Start development
# (Build scripts for class-based API will be added in Phase 4)
```

## 📞 **Questions or Issues?**

- Check the detailed plan in `CLASS_BASED_API_PLAN.md`
- Use the tracker in `CLASS_BASED_API_TRACKER.md`
- Review the original requirements in `class-based-api-requirements.md`

**Ready to start building the most developer-friendly icon system!** 🚀
