import { Plus, Minus, Tick } from './dist/icons/esm/index.js';

console.log('=== Testing Named Imports from Index ===\n');

const testIcons = [
  { name: 'Plus', icon: Plus },
  { name: 'Minus', icon: Minus },
  { name: 'Tick', icon: Tick }
];

testIcons.forEach(({ name, icon }) => {
  console.log(`${name}: ${typeof icon === 'function' ? '✅ Function' : '❌ Not Function'}`);
});

console.log('\n=== Testing Function Calls ===\n');

if (typeof Plus === 'function') {
  const result = Plus({ size: 20, color: 'green' });
  console.log('Plus function output length:', result.length);
  console.log('Contains SVG:', result.includes('<svg'));
}
