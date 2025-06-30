// Simple test to verify our API testing works
console.log('🔄 Testing SVA Icons API implementations...');

// Test 1: Check if CSS file exists and loads
const testCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/sva-icons-class-based.css';
  link.onload = () => console.log('✅ CSS loads successfully');
  link.onerror = () => console.log('❌ CSS failed to load');
  document.head.appendChild(link);
};

// Test 2: Check if web components can be imported
const testWebComponents = async () => {
  try {
    await import('../web-components/sva-icon.js');
    console.log('✅ Web components import successfully');
  } catch (error) {
    console.log('❌ Web components failed to import:', error.message);
  }
};

// Test 3: Check if React components can be imported
const testReactComponents = async () => {
  try {
    const HomeComponent = await import('../dist/react/esm/Home.js');
    console.log('✅ React components import successfully');
  } catch (error) {
    console.log('❌ React components failed to import:', error.message);
  }
};

// Run tests
testCSS();
testWebComponents();
testReactComponents();

console.log('🎯 API tests completed. Check the results above.');
