<?php

namespace DemoPlugin\Contracts;

interface FormRequestInterface {

    /**
     * Validate the request.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return mixed
     */
    public function validate();
}
