<?php

namespace DemoPlugin\Tests;


class ExampleTest extends \WP_UnitTestCase {

    function test_wordpress_and_plugin_are_loaded() {
        $this->assertTrue( function_exists( 'do_action' ) );
        $this->assertTrue( function_exists( 'plugin_name_init' ) );
        $this->assertTrue( class_exists( 'DemoPlugin\DemoPlugin' ) );
    }
}
