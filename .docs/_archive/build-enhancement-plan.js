// Enhanced update-icons script that cleans and rebuilds everything

const enhancedBuildCommands = [
  // 1. Clean everything first
  { name: 'clean', command: 'node scripts/clean-dist.js' },
  
  // 2. Build all icon formats
  { name: 'build:icons', command: 'npm run build:icons' },
  { name: 'build:sprite', command: 'npm run build:sprite' },
  { name: 'build:react', command: 'npm run build:react' },
  { name: 'build:web', command: 'npm run build:web' },
  { name: 'build:web-tree-shakable', command: 'npm run build:web-tree-shakable' },
  { name: 'build:create-icons', command: 'npm run build:create-icons' },
  { name: 'build:class-based', command: 'npm run build:class-based' },
  { name: 'build:css', command: 'npm run build:css' },
  { name: 'build:typescript', command: 'npm run build:typescript' }
];

// This ensures dist/ perfectly matches svg/ folder content
