<?php
/**
 * Plugin Name:         PayCheckMate
 * Plugin URI:          http://paycheckmate.com/
 * Description:         Pay Check Mate is a powerful and user-friendly payroll management solution that simplifies the payroll process for businesses of all sizes. It provides a comprehensive set of features that enables users to manage payroll efficiently and accurately, saving time and minimizing errors.
 * Version:             1.0.0
 * Requires PHP:        7.4
 * Requires at least:   5.6
 * Author:              Ratul Hasan
 * Author URI:          https://www.ratulhasan.com
 * License:             GPL-3.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         pcm
 * Domain Path:         /languages
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
