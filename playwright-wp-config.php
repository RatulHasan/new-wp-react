<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'payCheckMateUnitTests' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'password1234' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY', '1.~,mxq_J>[ttt,R|io-Cj C5Aa*D8jAInij-CK]x-r$)Eyv%yu^7*j=7]6g(rA=' );
define( 'SECURE_AUTH_KEY', 'QC19p9:Ihop]~)#Q}/@*Y]lf=;;t%[@MR@qi=fQB8%J$_xuMT7:^7(MBKp>_>UjA' );
define( 'LOGGED_IN_KEY', '6zViMoA(w-s,3Lk8<fP2UeRJ~tvV _vxnypx6N|^n9m%)y-G]LKC lNI2@bKdMU4' );
define( 'NONCE_KEY', '^>v+cxV;6A5h~;9+3Nh]d_(&hZxi?hvn?JztwVLzx&DU@ub<~Y4TZn~N}pKS]a[^' );
define( 'AUTH_SALT', '^d<>@sL#M3vW#CRMz0e9@Wq%Z[7/P;)[r=m)$McDemaHFn.D!()2Bb?]f+0BJti7' );
define( 'SECURE_AUTH_SALT', 'b<CfdbHYguM/;3FgZ1[nTk%)HC5:ZiBev 8@Z:1:izax4_TB?>OKsgK2%Q|AI=3V' );
define( 'LOGGED_IN_SALT', '~$XcgN%GISU0odFxoISu=jV{/,M}9?;])L0lzJ?.BjA $@Zo*;2!oT:kaSSu$~@_' );
define( 'NONCE_SALT', '`my8@GrL_0v#.cNVOfu4:+D5G$2qQ;;!G )tbB~RU^?vuH,UrupK!vrt8Cuiq0<n' );
/**#@-*/
/** * WordPress
 * database table prefix. * * You can have multiple installations in one database if you give each * a unique prefix.
 * Only numbers, letters, and underscores please! */
// phpcs:ignore
$table_prefix = 'wptests_';
define( 'SITE_URL', 'http://pay-check-mate.test' );
define( 'SITE_TITLE', 'Play WordPress Wright' );
define( 'ADMIN_USERNAME', 'admin' );
define( 'ADMIN_PASSWORD', 'admin' );
define( 'ADMIN_EMAIL', 'ratuljh@gmail.com' );

define( 'WP_DEBUG', true );
define( 'SCRIPT_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', true );

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . 'playwright-wp-config.php/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
