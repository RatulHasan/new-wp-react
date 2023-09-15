<?php
/**
 * PHPUnit bootstrap file.
 *
 * @package PayCheckMate
 */

if ( PHP_MAJOR_VERSION >= 8.1 ) {
    echo 'The scaffolded tests cannot currently be run on PHP 8.0+. See https://github.com/wp-cli/scaffold-command/issues/285' . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    exit( 1 );
}

// Composer autoloader must be loaded before WP_PHPUNIT__DIR will be available
require_once dirname( __FILE__, 3 ) . '/vendor/autoload.php';
$_tests_dir = getenv( 'WP_TESTS_DIR' ) ? getenv( 'WP_TESTS_DIR' ) : getenv( 'WP_PHPUNIT__DIR' );


if ( ! $_tests_dir ) {
    $_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( "{$_tests_dir}/includes/functions.php" ) ) {
    echo "Could not find {$_tests_dir}/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    exit( 1 );
}

// Give access to tests_add_filter() function.
require_once "{$_tests_dir}/includes/functions.php";

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
    //    _manually_load_required_plugins();
    require dirname( dirname( dirname( __FILE__ ) ) ) . '/pay-check-mate.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );


// Start up the WP testing environment.
require "{$_tests_dir}/includes/bootstrap.php";