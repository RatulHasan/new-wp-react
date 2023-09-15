<?php

namespace PayCheckMate\Contracts;

interface HookAbleApiInterface {

    /**
     * Call the necessary hooks.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function register_api_routes(): void;
}
