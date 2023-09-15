const fs      = require( 'fs' );
const replace = require( 'replace-in-file' );

const pluginFiles = [
	'includes/**/*',
	'plugin_name.php',
];

const { version } = JSON.parse( fs.readFileSync( 'package.json' ) );

replace(
	{
		files: pluginFiles,
		from: /[PLUGIN_NAME]_VERSION/g,
		to: version,
	}
);
