const fs      = require( 'fs' );
const replace = require( 'replace-in-file' );

const pluginFiles = [
	'includes/**/*',
	'ratul_hasan.php',
];

const { version } = JSON.parse( fs.readFileSync( 'package.json' ) );

replace(
	{
		files: pluginFiles,
		from: /RATUL_HASAN_VERSION/g,
		to: version,
	}
);
