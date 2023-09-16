<?php

namespace DemoPlugin\Contracts;

interface HookAbleApiInterface {

    /**
     * Call the necessary hooks.
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function register_api_routes(): void;
}
