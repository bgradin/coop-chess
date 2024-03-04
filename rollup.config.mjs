import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss';
import svg from "rollup-plugin-svg";
import sass from 'sass';
import { terser } from 'rollup-plugin-terser';

export default args => ({
  input: 'src/client/index.ts',
  output: {
    file: args['config-prod'] ? 'dist/index.min.js' : 'index.js',
    format: 'iife',
    name: 'main',
    plugins: args['config-prod']
      ? [
          terser({
            safari10: false,
            output: { comments: false },
          }),
        ]
      : [],
  },
  plugins: [
    resolve({
      browser: true,
    }),
    typescript(),
    commonjs(),
    scss({
      include: ['scss/*'],
      output: args['config-prod'] ? './dist/style.min.css' : './style.css',
      runtime: sass,
      ...(args['config-prod'] ? { outputStyle: 'compressed' } : {}),
    }),
    svg({ base64: true }),
  ],
});
