<?php

namespace DemoPlugin\Contracts;

interface HookAbleInterface {

    /**
     * Call the necessary hooks.
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function hooks(): void;
}
