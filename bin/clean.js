const fs = require('fs');
const path = require('path');

const buildDir = path.join('./', 'build');

fs.rm(buildDir, {recursive: true}, (err) => {
    if (err) {
        console.error(`Could not remove the directory: ${buildDir}`);
        return;
    }
    console.log(`Directory removed: ${buildDir}`);
});
