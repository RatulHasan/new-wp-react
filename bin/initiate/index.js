const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const userInputObject = {
    'Plugin Name': 'Demo',
    'Plugin URI': 'https://www.ratulhasan.com/',
    'Description': 'Demo Description',
    'Version': '1.0.0',
    'Requires PHP': '7.4',
    'Requires at least': '6.2',
    'Author': 'Ratul Hasan',
    'Author URI': 'https://www.ratulhasan.com/',
    'License': 'GPL-3.0-or-later',
    'License URI': 'https://www.gnu.org/licenses/gpl-2.0.html',
    'Text Domain': 'DemoTextDomain',
    'Domain Path': '/languages',
}

function promptUser () {
    const fields = Object.keys(userInputObject)

    function askField (index) {
        if (index >= fields.length) {
            processUserInputObject()
            return
        }

        const field = fields[index]
        rl.question(`Enter ${field} [${userInputObject[field]}]: `,
            (userInput) => {
                if (userInput) {
                    userInputObject[field] = userInput
                }
                askField(index + 1)
            })
    }

    askField(0)
}

function processUserInputObject () {
    const fields = Object.keys(userInputObject)
    const headerComment = fields.map((field) => {
        if (field === 'Text Domain') {
            // If the text domain is DemoTextDomain
            if (userInputObject[field] === 'DemoTextDomain') {
                // If yes, then replace it with the plugin name in lowercase
                userInputObject[field] = userInputObject[fields[0]].replace(
                    /\s/g, '-').toLowerCase()
            }
        }
        return ` * ${field}: ${userInputObject[field]}`
    }).join('\n')

    const headerCommentString = `/**
${headerComment}
 *
 * @package WordPress
 */`;

    const pluginName = userInputObject[fields[0]]

    if (!pluginName) {
        console.log('Plugin name is required')
        rl.close()
        return
    }

    const oldFileName = 'demo.php'
    const newFileName = `${pluginName.replace(/\s/g, '-').toLowerCase()}.php`

    // Read the existing PHP file
    fs.readFile(oldFileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err)
            rl.close()
            return
        }

        // Replace the existing header comment with the new one
        const pluginInitials = data.replace(/\/\*\*[\s\S]*?\*\//, headerCommentString)
        // Replace [PLUGIN_NAME] with pluginName (all uppercase and spaces replaced with underscores)
        const PLUGIN_NAME = pluginInitials.replace(/\[PLUGIN_NAME\]/g, pluginName.replace(/\s/g, '_').toUpperCase())
        // Replace plugin_name with pluginName (all lowercase and spaces replaced with underscores)
        const finalData = PLUGIN_NAME.replace(/plugin_name/g, pluginName.replace(/\s/g, '_').toLowerCase())

        // Write the modified content back to the file
        fs.writeFile(newFileName, finalData, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr)
            } else {
                console.log(
                    `File "${oldFileName}" renamed to "${newFileName}"`)
                // Delete the old file
                fs.unlink(oldFileName, (deleteErr) => {
                    if (deleteErr) {
                        console.error('Error deleting file:', deleteErr)
                    } else {
                        console.log(`File "${oldFileName}" deleted`)
                    }
                })

                // Replace the plugin name in package.json
                const packageJson = JSON.parse(fs.readFileSync('package.json'))
                packageJson.name = pluginName.replace(/\s/g, '-').toLowerCase()
                fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))

                // Replace the plugin_name and [PLUGIN_NAME] in version-replace.js
                const versionReplaceJs = fs.readFileSync('bin/version-replace.js', 'utf8')
                const newVersionReplaceJs = versionReplaceJs.replace(/plugin_name/g, pluginName.replace(/\s/g, '_').toLowerCase())
                const newVersionReplaceJs2 = newVersionReplaceJs.replace(/\[PLUGIN_NAME\]/g, pluginName.replace(/\s/g, '_').toUpperCase())
                fs.writeFileSync('bin/version-replace.js', newVersionReplaceJs2)
            }

            rl.close()
        })
    })
}

promptUser()
