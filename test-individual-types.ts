// This tests individual .d.ts files work correctly
import Plus from './dist/icons/esm/plus.js';
import Minus from './dist/icons/esm/minus.js';
import Car from './dist/icons/esm/car.js';

// Test that TypeScript understands the function signatures
const iconConfig = {
  size: 24,
  color: 'blue',
  className: 'test-icon',
  strokeWidth: 1.5,
  title: 'Test Icon',
  focusable: false
};

const plusIcon = Plus(iconConfig);
const minusIcon = Minus({ size: 16 });
const carIcon = Car();

console.log('Individual imports work!', typeof plusIcon === 'string');
