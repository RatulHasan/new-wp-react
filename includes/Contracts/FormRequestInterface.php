<?php

namespace PayCheckMate\Contracts;

interface FormRequestInterface {

    /**
     * Validate the request.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return mixed
     */
    public function validate();
}
