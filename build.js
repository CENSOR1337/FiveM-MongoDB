const { build } = require('esbuild');
const production = process.argv.findIndex(argItem => argItem === '--mode=production') >= 0;
const fse = require('fs-extra');
const buildPath = './dist';

async function copyBuildOutput() {
  fse.ensureDirSync(buildPath, err => {
    if (err) return console.error(err)
  })
  fse.ensureDirSync(`${buildPath}/lib`, err => {
    if (err) return console.error(err)
  })

  fse.copySync('./fxmanifest.lua', `${buildPath}/fxmanifest.lua`);
  fse.copySync('./example.lua', `${buildPath}/example.lua`);
  fse.copySync('./lib', `${buildPath}/lib`);
}

build({
  entryPoints: ['./src/index.ts'],
  outfile: `${buildPath}/build/server.js`,
  bundle: true,
  platform: 'node',
  logLevel: 'info',
  minify: production,
  watch: production ? false : {
    onRebuild: async (err, res) => {
      if (err) {
        return console.error(`[${context}]: Rebuild failed`, err);
      }
      await copyBuildOutput();
      console.log(`Rebuild succeeded, warnings:`, res.warnings);
    },
  },
}).then(async () => {
  await copyBuildOutput();
  console.log('Build complete');
});