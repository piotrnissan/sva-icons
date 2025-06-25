import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'web-components/sva-icon-embedded.js',
    output: [
      {
        file: 'dist/web-components/sva-icon.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/web-components/sva-icon.umd.js',
        format: 'umd',
        name: 'SvaIcon',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      terser(),
    ],
  },
];
