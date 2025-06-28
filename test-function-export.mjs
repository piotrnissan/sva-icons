import Plus from './dist/icons/esm/plus.js';

console.log('Plus export type:', typeof Plus);
console.log('Plus is function:', typeof Plus === 'function');

if (typeof Plus === 'function') {
  const svgOutput = Plus({size: 20, color: 'red'});
  console.log('Plus function output preview:', svgOutput.substring(0, 150) + '...');
  console.log('Function call successful!');
} else {
  console.log('ERROR: Plus is not exported as a function');
}
