const fs = require('fs')
const path = require('path')

const packageJson = JSON.parse(fs.readFileSync('package.json'))
const pluginFilesFoldersToCopy = [
  '/includes',
  '/languages',
  '/vendor',
  'LICENSE',
  'readme.txt',
  'changelog.txt',
  `${packageJson.name}.php`,
];

// Copy files and folders to build directory.
const sourceRoot = './';
const buildDirectory = './build';

// Copy file function
function copyFile(sourcePath, buildPath) {
  fs.stat(sourcePath, (err, stats) => {
    if (err) {
      console.error(`Error: ${err.message}.`);
      return;
    }
    if (stats.isFile()) {
      fs.copyFile(sourcePath, buildPath, err => {
        if (err) {
          console.error(`Error: ${err.message}.`);
          return;
        }
        console.log(`File copied: ${buildPath}`);
      });
    } else {
      console.error(`Error: ${sourcePath} is not a file.`);
    }
  });
};

// Copy the files
fs.mkdir(buildDirectory, { recursive: true }, err => {
  if (err) {
    console.error(`Error creating build directory: ${err.message}`);
    return;
  }
});

for (const fileOrFolder of pluginFilesFoldersToCopy) {
  const sourcePath = path.join(sourceRoot, fileOrFolder);
  console.log(`Source path: ${sourcePath}`);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: ${sourcePath} does not exist`);
    continue;
  }
  const destinationPath = path.join(sourceRoot, buildDirectory, fileOrFolder);
  if (fs.lstatSync(sourcePath).isDirectory()) {
    copyDirectory(sourcePath, destinationPath);
  } else {
    copyFile(sourcePath, destinationPath);
  }
}
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  fs.readdir(src, (err, files) => {
    if (err) {
      console.error(`Could not read the directory: ${src}`);
      return;
    }
    files.forEach(file => {
      const filePath = path.join(src, file);
      const destPath = path.join(dest, file);
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error(`Could not get information about the file: ${filePath}`);
          return;
        }
        if (stats.isFile()) {
          copyFile(filePath, destPath)
        } else if (stats.isDirectory()) {
          fs.mkdir(destPath, { recursive: true }, error => {
            if (error) {
              console.error(`Could not create the directory: ${destPath}`);
              return;
            }
            copyDirectory(filePath, destPath);
          });
        }
      });
    });
  });
}
