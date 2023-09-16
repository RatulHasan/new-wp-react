<?php

namespace DemoPlugin\Hooks;

use DemoPlugin\Classes\Employee;
use DemoPlugin\Contracts\HookAbleInterface;

class Assets implements HookAbleInterface {

    public function hooks(): void {
        add_action( 'init', [ $this, 'register_scripts' ] );
        // This asset needs to be loaded after pro-assets.
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 12 );
    }

    /**
     * Register scripts.
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function register_scripts(): void {
        $file       = PAY_CHECK_MATE_DIR . '/assets/index.asset.php';
        $asset_file = require_once $file;
        $src_js     = PAY_CHECK_MATE_URL . '/assets/index.js';
        $src_css    = PAY_CHECK_MATE_URL . '/assets/index.css';
        wp_register_script(
            'plugin-name-js',
            $src_js,
            $asset_file['dependencies'],
            $asset_file['version'],
            true,
        );

        wp_register_style(
            'plugin-name-css',
            $src_css,
            [],
            $asset_file['version'],
        );
    }

    /**
     * Enqueue scripts.
     *
     * @since DOKAN_PRO_SINCE
     * @throws \Exception
     * @return void
     */
    public function enqueue_scripts(): void {
        if ( 'toplevel_page_plugin-name' !== get_current_screen()->id ) {
            return;
        }

        $this->register_localize_script();
        wp_enqueue_script( 'plugin-name-js' );
        wp_enqueue_style( 'plugin-name-css' );
    }

    /**
     * Register translations.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws \Exception
     * @return void
     */
    public function register_localize_script(): void {
        $user     = wp_get_current_user();
        $employee = new Employee();

        $employee = $employee->get_employee_by_user_id( $user->ID );

        unset( $employee->user_pass );
        // @phpstan-ignore-next-line
        $user->employee = $employee->get_employee();
        wp_localize_script(
            'plugin-name-js', 'payCheckMate', [
				'ajaxUrl'              => admin_url( 'admin-ajax.php' ),
				'plugin_name_nonce' => wp_create_nonce( 'plugin_name_nonce' ),
				'currentUser'          => $user,
			],
        );
    }
}
