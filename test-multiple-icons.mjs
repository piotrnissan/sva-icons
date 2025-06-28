import Plus from './dist/icons/esm/plus.js';
import Minus from './dist/icons/esm/minus.js';
import Tick from './dist/icons/esm/tick.js';

const testIcons = [
  { name: 'Plus', icon: Plus },
  { name: 'Minus', icon: Minus },
  { name: 'Tick', icon: Tick }
];

console.log('=== SVA Icons Function Export Test ===\n');

testIcons.forEach(({ name, icon }) => {
  console.log(`${name}:`);
  console.log(`  Type: ${typeof icon}`);
  console.log(`  Is Function: ${typeof icon === 'function'}`);
  
  if (typeof icon === 'function') {
    try {
      const svg = icon({ size: 16, color: 'blue' });
      console.log(`  Output Preview: ${svg.substring(0, 80)}...`);
      console.log(`  ✅ SUCCESS`);
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}`);
    }
  } else {
    console.log(`  ❌ FAILED: Not exported as function`);
  }
  console.log('');
});

console.log('=== Summary ===');
const allFunctions = testIcons.every(({ icon }) => typeof icon === 'function');
console.log(`All icons exported as functions: ${allFunctions ? '✅ YES' : '❌ NO'}`);
