import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        entryFileNames: 'cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        dir: 'dist',
        entryFileNames: 'esm/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.build.json' })],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/esm/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
