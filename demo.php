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
use PayCheckMate\PayCheckMate;

if ( ! defined( 'ABSPATH' ) ) {
    exit();
}

require 'vendor/autoload.php';

if ( ! defined( 'PAY_CHECK_MATE_PLUGIN_VERSION' ) ) {
    define( 'PAY_CHECK_MATE_PLUGIN_VERSION', '1.0.0' );
}

if ( ! defined( 'PAY_CHECK_MATE_ASSET' ) ) {
    define( 'PAY_CHECK_MATE_ASSET', plugins_url( 'assets', __FILE__ ) );
}

if ( ! defined( 'PAY_CHECK_MATE_FILE' ) ) {
    define( 'PAY_CHECK_MATE_FILE', __FILE__ );
}

if ( ! defined( 'PAY_CHECK_MATE_DIR' ) ) {
    define( 'PAY_CHECK_MATE_DIR', __DIR__ );
}

if ( ! defined( 'PAY_CHECK_MATE_VERSION' ) ) {
    define( 'PAY_CHECK_MATE_VERSION', '1.0.0' );
}

if ( ! defined( 'PAY_CHECK_MATE_BASE_NAME' ) ) {
    define( 'PAY_CHECK_MATE_BASE_NAME', plugin_basename( __FILE__ ) );
}

if ( ! defined( 'PAY_CHECK_MATE_URL' ) ) {
    define( 'PAY_CHECK_MATE_URL', plugins_url( '', __FILE__ ) );
}

/*
 * Main function to initialize the plugin.
 *
 * @since PAY_CHECK_MATE_SINCE
 *
 * @return PayCheckMate
 */
function pcm(): PayCheckMate {
    return PayCheckMate::get_instance();
}

/**
 * Run the plugin.
 *
 * @since PAY_CHECK_MATE_SINCE
 */
pcm();
