const path = require('path');
const fs = require('fs');

const projectDir = process.cwd();
const resolvedDir = path.resolve(projectDir);

const setupMessage = 'To initialize your project configuration, run --setup or -s';
const fileList = fs.readdirSync(path.join(__dirname, 'templates'));

const doSetup = () => {
  const hasHelp = process.argv.find((arg) => arg === '--help' || arg === '-h');
  if (hasHelp) {
    console.log(setupMessage);
    return;
  }

  const isSetup = process.argv.find((item) => item === '--setup' || item === '-s');
  if (!isSetup) {
    console.log(setupMessage);
    return;
  }

  fileList.forEach((file) => {
    const filePath = path.join(resolvedDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`${file} already exists`);
      return;
    }
    fs.copyFileSync(path.join(__dirname, 'templates', file), filePath);
    console.log(`${file} created`);
  });

  const packageJson = require(path.join(resolvedDir, 'package.json'));

  const newPackageJson = {
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      build: 'rm -rf ./lib && tsc -p tsconfig.build.json',
      dev: 'ts-node ./src/index.ts',
      'dev:watch': 'ts-node-dev ./src/index.ts',
      lint: 'eslint ./src',
      'lint:fix': 'eslint ./src --fix',
      prettify: 'prettier --write "./src/**/*.{ts,tsx}"',
      release: 'semantic-release -e ./.releaserc.json',
      test: 'jest --runInBand --coverage',
      'test:watch': 'jest --runInBand --watch',
    },
  };

  fs.writeFileSync(
    path.join(resolvedDir, 'package.json'),
    JSON.stringify(newPackageJson, null, 2),
    { flag: 'w' },
  );

  console.log(`package.json edited`);
  console.log('Done!');
};

module.exports = doSetup;
