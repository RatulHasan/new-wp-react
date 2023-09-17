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
    const validateField = (field, userInput) => {
        if (!userInputObject[field] && !userInput) {
            console.log('\x1b[31m%s\x1b[0m', `${field} is required`);
            return false;
        }
        if (userInput) {
            console.log('\x1b[32m%s\x1b[0m', '✓');
            userInputObject[field] = userInput;
        }
        return true;
    };

    function askField(index) {
        if (index >= fields.length) {
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
            if (validateField(field, userInput)) {
                askField(index + 1);
            } else {
                askField(index);
            }
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
        if (filePath.includes(ignoreFolders[i])) {
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

            const PLUGIN_NAME = userInputObject['Plugin Name'].replace(/\s/g, '_').toUpperCase();
            const updatedPluginName = updatedContent.replace(/PLUGIN_NAME/g, PLUGIN_NAME);

            const plugin_name = userInputObject['Plugin Name'].replace(/\s/g, '-').toLowerCase();
            const updatedPlugin = updatedPluginName.replace(/plugin-name/g, plugin_name);

            const plugin_name2 = userInputObject['Plugin Name'].replace(/\s/g, '_').toLowerCase();
            const updatedPlugin2 = updatedPlugin.replace(/plugin_name/g, plugin_name2);

            const updatedPlugin3 = updatedPlugin2.replace(/pluginName/g, nameSpace);

            fs.writeFileSync(filePath, updatedPlugin3, 'utf8');

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
    if (!fs.existsSync(oldFileName)) {
        // Add red color
        console.log('\x1b[31m%s\x1b[0m', `File "${oldFileName}" not found, maybe you already ran this script?`);
        rl.close();
        return;
    }
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
            // Run composer install and dump-autoload
            console.log('Running composer install and dump-autoload -o');
            exec('composer install && composer dump-autoload -o', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });

            // Run npm install
            console.log('Running npm install');
            exec('npm install', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);

                // Build the plugin after npm installation
                buildPlugin();
            });
        });
    });
}

function buildPlugin() {
    console.log('Building the plugin');
    exec('npm run build', (buildErr, buildStdout, buildStderr) => {
        if (buildErr) {
            console.error(buildErr);
            return;
        }
        console.log(buildStdout);

        // Close the readline interface after build
        rl.close();
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
