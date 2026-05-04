import * as esbuild from 'esbuild';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';

await esbuild.build({
  entryPoints: ['./dist/config/config.js'],
  outfile: './dist/config/config-min.js',

  bundle: true,
  format: 'esm',
  minify: true,
  platform: 'neutral',

  external: [
    'technology-scheme-editor-core',
    '@adobe/*',
    '@node-projects/*',
    'ag-grid-community',
    'ag-grid-community/*',
    'dock-spawn-ts',
    'mobile-drag-drop',
    'monaco-editor',
    'nanoid',
    'pako',
    'wunderbaum',
    'signal-polyfill'
  ],

  plugins: [
    minifyHTMLLiteralsPlugin()
  ]
}).catch(() => process.exit(1));