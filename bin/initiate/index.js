const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const userInputObject = {
    "Plugin Name": "Demo",
    "Plugin URI": "DemoURI",
    "Description": "DemoDescription",
    "Version": "1.0.0",
    "Requires PHP": "7.4",
    "Requires at least": "6.2",
    "Author": "DemoAuthor",
    "Author URI": "DemoAuthorURI",
    "License": "GPL-3.0-or-later",
    "License URI": "https://www.gnu.org/licenses/gpl-2.0.html",
    "Text Domain": "DemoTextDomain",
    "Domain Path": "/languages"
};

function promptUser() {
    const fields = Object.keys(userInputObject);

    function askField(index) {
        if (index >= fields.length) {
            processUserInputObject();
            return;
        }

        const field = fields[index];
        rl.question(`Enter ${field} [${userInputObject[field]}]: `, (userInput) => {
            if (userInput) {
                userInputObject[field] = userInput;
            }
            askField(index + 1);
        });
    }

    askField(0);
}

function processUserInputObject() {
    const fields = Object.keys(userInputObject);
    const headerComment = fields.map((field) => {
        if (field === 'Text Domain') {
            // If the text domain is DemoTextDomain
            if (userInputObject[field] === 'DemoTextDomain') {
                // If yes, then replace it with the plugin name in lowercase
                userInputObject[field] = userInputObject[fields[0]].replace(/\s/g, '-').toLowerCase();
            }
        }
        return ` * ${field}: ${userInputObject[field]}`;
    }).join('\n');

    const headerCommentString = `/**
${headerComment}
 *
 * @package WordPress
 */`;

    const pluginName = userInputObject[fields[0]];

    if (!pluginName) {
        console.log('Plugin name is required');
        rl.close();
        return;
    }

    const oldFileName = 'demo.php';
    const newFileName = `${pluginName.replace(/\s/g, '-').toLowerCase()}.php`;

    // Read the existing PHP file
    fs.readFile(oldFileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            rl.close();
            return;
        }

        // Replace the existing header comment with the new one
        const newData = data.replace(/\/\*\*[\s\S]*?\*\//, headerCommentString);

        // Write the modified content back to the file
        fs.writeFile(newFileName, newData, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr);
            } else {
                console.log(`File "${oldFileName}" renamed to "${newFileName}"`);
                // Delete the old file
                fs.unlink(oldFileName, (deleteErr) => {
                    if (deleteErr) {
                        console.error('Error deleting file:', deleteErr);
                    } else {
                        console.log(`File "${oldFileName}" deleted`);
                    }
                });
            }

            rl.close();
        });
    });
}

promptUser();
