// Test file to verify TypeScript definitions work correctly
import Plus from './dist/icons/esm/plus.js';
import Minus from './dist/icons/esm/minus.js';
import { Car, Search, Calendar } from './dist/icons/esm/index.js';

// Test individual imports with full type checking
const plusIcon: string = Plus({
  size: 24,
  color: 'red',
  className: 'my-icon',
  strokeWidth: 2,
  title: 'Add item',
  focusable: true
});

const minusIcon: string = Minus({
  size: '1.5rem',
  color: '#333333'
});

// Test named imports from index
const carIcon: string = Car({
  size: 32,
  color: 'currentColor'
});

const searchIcon: string = Search({
  className: 'search-icon',
  'aria-label': 'Search content'
});

const calendarIcon: string = Calendar();

// Test that functions return strings
console.log('Plus icon type:', typeof plusIcon);
console.log('Plus icon contains SVG:', plusIcon.includes('<svg'));
console.log('TypeScript definitions are working correctly! ✅');
