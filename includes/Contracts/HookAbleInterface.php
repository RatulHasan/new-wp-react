<?php

namespace PayCheckMate\Contracts;

interface HookAbleInterface {

    /**
     * Call the necessary hooks.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function hooks(): void;
}
