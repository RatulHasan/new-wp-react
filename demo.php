<?php
/**
 * Plugin Name:         [DemoPlugin]
 * Plugin URI:          [DemoPluginURI]
 * Description:         [DemoPluginDescription]
 * Version:             1.0.0
 * Requires PHP:        [DemoPluginRequiresPHP]
 * Requires at least:   [DemoPluginRequiresAtLeast]
 * Author:              [DemoPluginAuthor]
 * Author URI:          [DemoPluginAuthorURI]
 * License:             [DemoPluginLicense]
 * License URI:         [DemoPluginLicenseURI]
 * Text Domain:         [DemoPluginTextDomain]
 * Domain Path:         [DemoPluginDomainPath]
 *
 * @package WordPress
 */

// To prevent direct access, if not define WordPress ABSOLUTE PATH then exit.
use DemoPlugin\DemoPlugin;

if ( ! defined( 'ABSPATH' ) ) {
    exit();
}

require 'vendor/autoload.php';

if ( ! defined( 'PLUGIN_NAME_PLUGIN_VERSION' ) ) {
    define( 'PLUGIN_NAME_PLUGIN_VERSION', '1.0.0' );
}

/*
 * Main function to initialize the plugin.
 *
 * @since PLUGIN_NAME_VERSION
 *
 * @return PayCheckMate
 */
function plugin_name(): DemoPlugin {
    return DemoPlugin::get_instance();
}

/**
 * Run the plugin.
 *
 * @since PLUGIN_NAME_VERSION
 */
plugin_name();
