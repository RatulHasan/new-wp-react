<?php

namespace DemoPlugin\Hooks;

use DemoPlugin\Contracts\HookAbleInterface;

class AdminMenu implements HookAbleInterface {

    /**
     * All the necessary hooks.
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function hooks(): void {
        add_action( 'admin_menu', [ $this, 'admin_menu' ] );
    }

    /**
     * Add menu page.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return void
     */
    public function admin_menu(): void {
        $capabilities = 'manage_options';
        add_menu_page(
            __( 'DemoPlugin', 'plugin-name' ),
            __( 'DemoPlugin', 'plugin-name' ),
            $capabilities,
            'plugin-name',
            [ $this, 'menu_page' ],
            'dashicons-admin-generic',
            20
        );
    }

    /**
     * Menu page callback.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return void
     */
    public function menu_page(): void {
        echo '<div id="plugin-name-root" class="h-full wrap custom-font"></div>';
    }
}
