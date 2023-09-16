const fs = require('fs');
const archiver = require('archiver');

const packageJson = JSON.parse(fs.readFileSync('package.json'));

const buildFolder = 'build';
if (!fs.existsSync(buildFolder)) {
  fs.mkdirSync(buildFolder);
}

const outputFile = `./${packageJson.name}.zip`;

const archive = archiver('zip', { zlib: { level: 9 }});
const stream = fs.createWriteStream(outputFile);

stream.on('close', () => {
  console.log(`Archive created at ${outputFile} with ${archive.pointer()} total bytes.`);

  fs.rename(outputFile, `./build/${outputFile}`, err => {
    if (err) {
      console.error(`Error moving archive: ${err}`);
    } else {
      console.log(`Archive moved to ./build/${outputFile}`);
    }
  });
});

archive.on('warning', err => {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', err => {
  throw err;
});

archive.pipe(stream);

archive.directory(buildFolder, false);

archive.finalize();
