const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const userInputObject = {
    'Plugin Name': '',
    'Plugin URI': 'https://www.ratulhasan.com/',
    'Description': 'DemoPlugin Description',
    'Version': '1.0.0',
    'Requires PHP': '7.4',
    'Requires at least': '6.2',
    'Author': 'Ratul Hasan',
    'Author URI': 'https://www.ratulhasan.com/',
    'License': 'GPL-3.0-or-later',
    'License URI': 'https://www.gnu.org/licenses/gpl-2.0.html',
    'Text Domain': 'DemoPluginTextDomain',
    'Domain Path': '/languages',
};

function promptUser() {
    const fields = Object.keys(userInputObject);

    function askField(index) {
        if (index >= fields.length) {
            // Plugin name should be in PascalCase and remove end spaces
            const pluginName = userInputObject['Plugin Name'].replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }).replace(/\s+$/, '');
            if (!pluginName) {
                console.log('Plugin name is required');
                rl.close();
                return;
            }
            processUserInputObject(pluginName);
            return;
        }

        const field = fields[index];
        rl.question(`Enter ${field} [${userInputObject[field]}]: `, (userInput) => {
            if (!userInputObject[field] && !userInput) {
                console.log('\x1b[31m%s\x1b[0m', `${field} is required`);
                askField(index);
                return;
            }

            if (userInput) {
                console.log('\x1b[32m%s\x1b[0m', '✓');
                userInputObject[field] = userInput;
            }
            askField(index + 1);
        });
    }

    askField(0);
}

function updatePackageJson(pluginName) {
    const packageJson = JSON.parse(fs.readFileSync('package.json'));
    packageJson.name = pluginName.replace(/\s/g, '-').toLowerCase();
    packageJson.version = userInputObject['Version'];
    packageJson.homepage = userInputObject['Plugin URI'];
    packageJson.description = userInputObject['Description'];
    packageJson.author = userInputObject['Author'];
    packageJson.license = userInputObject['License'];
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('package.json updated');
}

function updateVersionReplaceJs(pluginName) {
    const versionReplaceJs = fs.readFileSync('bin/version-replace.js', 'utf8');
    const nameUpperCase = pluginName.replace(/\s/g, '_').toUpperCase();
    const nameLowerCase = pluginName.replace(/\s/g, '-').toLowerCase();
    const newVersionReplaceJs = versionReplaceJs.replace(/plugin_name/g, nameLowerCase);
    const newVersionReplaceJs2 = newVersionReplaceJs.replace(/PLUGIN_NAME/g, nameUpperCase);
    fs.writeFileSync('bin/version-replace.js', newVersionReplaceJs2);
    console.log('version-replace.js updated');
}

function updateComposerJson(pluginName) {
    const nameSpace = `${pluginName.replace(/\s/g, '')}\\`;
    const nameSpaceDev = `${pluginName.replace(/\s/g, '')}\\Tests\\`;

    const composerJson = JSON.parse(fs.readFileSync('composer.json'));
    composerJson.name = `${userInputObject['Author'].replace(/\s/g, '-').toLowerCase()}/${pluginName.replace(/\s/g, '-').toLowerCase()}`;
    composerJson.description = userInputObject['Description'];
    composerJson.require.php = `>= ${userInputObject['Requires PHP']}`;

    // Update autoload and autoload-dev psr-4 entries
    composerJson['autoload']['psr-4'][nameSpace] = 'includes/';
    composerJson['autoload-dev']['psr-4'][nameSpaceDev] = 'tests/phpunit/';

    // Delete the old autoload and autoload-dev entries
    delete composerJson['autoload']['psr-4']['DemoPlugin\\'];
    delete composerJson['autoload-dev']['psr-4']['DemoPlugin\\Tests\\'];

    composerJson.authors[0].name = userInputObject['Author'];
    composerJson.authors[0].homepage = userInputObject['Author URI'];

    fs.writeFileSync('composer.json', JSON.stringify(composerJson, null, 2));
    console.log('composer.json updated');

    // Run composer install and dump-autoload
    console.log('Running composer install and dump-autoload -o');
    exec('composer install && composer dump-autoload -o', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    // Get root folder name
    const rootFolder = __dirname.replace(/bin\/initiate/g, '');
    // nameSpace without \\ at the end
    const name = `${pluginName.replace(/\s/g, '')}`;
    updateFiles(rootFolder, name);
}

function shouldIgnore(filePath) {
    const ignoreFolders = [
        'node_modules',
        'vendor',
        '.git',
        '.idea',
        '.vscode',
        'build',
        'dist',
        'assets',
        'initiate'
    ];
    for (let i = 0; i < ignoreFolders.length; i++) {
        if (filePath.indexOf(ignoreFolders[i]) !== -1) {
            return true;
        }
    }
    return false;
}

function updateFiles(filePath, nameSpace) {
    const includesFolder = filePath;
    fs.readdirSync(includesFolder).forEach((file) => {
        const filePath = `${includesFolder}/${file}`;
        // If this is a folder, recursively call this function
        if (fs.statSync(filePath).isDirectory() && !shouldIgnore(filePath)) {
            updateFiles(filePath, nameSpace);
            return;
        }
        if (fs.statSync(filePath).isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const updatedContent = fileContent.replace(/DemoPlugin/g, nameSpace);

            const ALL_NEW = userInputObject['Plugin Name'].replace(/\s/g, '_').toUpperCase();
            const updatedPluginName = updatedContent.replace(/ALL_NEW/g, ALL_NEW);

            const all_new = userInputObject['Plugin Name'].replace(/\s/g, '-').toLowerCase();
            const all_new2 = userInputObject['Plugin Name'].replace(/\s/g, '_').toLowerCase();
            const updatedPlugin = updatedPluginName.replace(/plugin-name/g, all_new);
            const updatedPlugin2 = updatedPlugin.replace(/plugin_name/g, all_new2);
            fs.writeFileSync(filePath, updatedPlugin2, 'utf8');

            // If the file name is DemoPlugin.php, rename it to PluginName.php
            if (file === 'DemoPlugin.php') {
                fs.renameSync(filePath, `${includesFolder}/${nameSpace}.php`);
            }
            console.log(`Updated ${filePath}`);
        }
    });
}

function processUserInputObject(pluginName) {
    const oldFileName = 'demo.php';
    const newFileName = `${pluginName.replace(/\s/g, '-').toLowerCase()}.php`;

    fs.readFile(oldFileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            rl.close();
            return;
        }

        const headerCommentString = generateHeaderCommentString(pluginName);

        const pluginInitials = data.replace(/\/\*\*[\s\S]*?\*\//, headerCommentString);
        const nameUpperCase = pluginInitials.replace(/PLUGIN_NAME/g, pluginName.replace(/\s/g, '_').toUpperCase())
        const finalData = nameUpperCase.replace(/plugin_name/g, pluginName.replace(/\s/g, '_').toLowerCase())

        fs.writeFile(newFileName, finalData, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr);
            } else {
                console.log(`File "${oldFileName}" renamed to "${newFileName}"`);
            }

            // Update other files
            updatePackageJson(pluginName);
            updateVersionReplaceJs(pluginName);
            updateComposerJson(pluginName);

            // Delete demo.php
            fs.unlinkSync(oldFileName);
            rl.close();
        });
    });
}

function generateHeaderCommentString(pluginName) {
    const fields = Object.keys(userInputObject);
    const headerComment = fields.map((field) => {
        if (field === 'Text Domain' && userInputObject[field] === 'DemoPluginTextDomain') {
            userInputObject[field] = userInputObject[fields[0]].replace(/\s/g, '-').toLowerCase();
        }
        if (field === 'Plugin Name') {
            userInputObject[field] = pluginName;
        }
        return ` * ${field}: ${userInputObject[field]}`;
    }).join('\n');

    return `/**
${headerComment}
 *
 * @package WordPress
 */`;
}

promptUser();
