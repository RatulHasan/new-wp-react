const fs      = require( 'fs' );
const replace = require( 'replace-in-file' );

const pluginFiles = [
	'includes/**/*',
	'pay-check-mate.php',
];

const { version } = JSON.parse( fs.readFileSync( 'package.json' ) );

replace(
	{
		files: pluginFiles,
		from: /PAY_CHECK_MATE_SINCE/g,
		to: version,
	}
);
