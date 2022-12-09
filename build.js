const { build } = require('esbuild');
const production = process.argv.findIndex(argItem => argItem === '--mode=production') >= 0;

build({
  entryPoints: ['./src/index.ts'],
  outfile: 'dist/build.js',
  bundle: true,
  platform: 'node',
  logLevel: 'info',
  minify: production,
  watch: !production,
});