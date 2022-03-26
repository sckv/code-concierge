const path = require('path');
const fs = require('fs');

const projectDir = process.cwd();
const resolvedDir = path.resolve(projectDir);

const setupMessage = 'To initialize your project configuration, run --setup or -s';
const fileList = fs.readdirSync(path.join(__dirname, '..', 'templates'));

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
    fs.copyFileSync(path.join(__dirname, '..', 'templates', file), filePath);
    console.log(`${file} created`);
  });
};

module.exports = doSetup;
