// Test import to verify class-based system can be loaded
console.log('Testing imports...');

try {
  // Test class-based import
  import('sva-icons/class-based').then(module => {
    console.log('✅ Class-based module loaded:', Object.keys(module));
  }).catch(err => {
    console.error('❌ Class-based import failed:', err);
  });

  // Test icons-browser import
  import('../src/icons-browser.js').then(module => {
    console.log('✅ Icons browser loaded, icons count:', Object.keys(module.iconRegistry || {}).length);
  }).catch(err => {
    console.error('❌ Icons browser import failed:', err);
  });

} catch (err) {
  console.error('❌ Import test failed:', err);
}
