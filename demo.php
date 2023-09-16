<?php
/**
 * Plugin Name:         [Demo]
 * Plugin URI:          [DemoURI]
 * Description:         [DemoDescription]
 * Version:             1.0.0
 * Requires PHP:        [DemoRequiresPHP]
 * Requires at least:   [DemoRequiresAtLeast]
 * Author:              [DemoAuthor]
 * Author URI:          [DemoAuthorURI]
 * License:             [DemoLicense]
 * License URI:         [DemoLicenseURI]
 * Text Domain:         [DemoTextDomain]
 * Domain Path:         [DemoDomainPath]
 *
 * @package WordPress
 */

// To prevent direct access, if not define WordPress ABSOLUTE PATH then exit.
use Demo\Demo;

if ( ! defined( 'ABSPATH' ) ) {
    exit();
}

require 'vendor/autoload.php';

if ( ! defined( '[PLUGIN_NAME]_PLUGIN_VERSION' ) ) {
    define( '[PLUGIN_NAME]_PLUGIN_VERSION', '1.0.0' );
}

/*
 * Main function to initialize the plugin.
 *
 * @since [PLUGIN_NAME]_VERSION
 *
 * @return PayCheckMate
 */
function plugin_name(): Demo {
    return Demo::get_instance();
}

/**
 * Run the plugin.
 *
 * @since [PLUGIN_NAME]_VERSION
 */
plugin_name();
