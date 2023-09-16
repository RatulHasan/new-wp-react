<?php

namespace DemoPlugin;

use DemoPlugin\Contracts\HookAbleApiInterface;
use DemoPlugin\Contracts\HookAbleInterface;
use ReflectionClass;

final class DemoPlugin {

    /**
     * @var DemoPlugin|null
     */
    protected static ?DemoPlugin $instance = null;

    /**
     * All the hook classes.
     *
     * @var array|string[]
     */
    protected array $hook_classes = [
        'DemoPlugin\Hooks\AdminMenu',
        'DemoPlugin\Hooks\Assets',
    ];

    /**
     * All the controller classes.
     *
     * @var array<string, mixed>
     */
    protected array $classes = [
        'employee' => [
            'class' => 'DemoPlugin\Classes\Employee',
        ],
    ];

    /**
     * All the model classes.
     *
     * @var array<string, mixed>
     */
    protected array $model_classes = [
        'employee_model' => [
            'class' => 'DemoPlugin\Models\EmployeeModel',
        ],
        'salary_history_model' => [
            'class' => 'DemoPlugin\Models\SalaryHistoryModel',
        ],
    ];

    /**
     * All the request classes.
     *
     * @var array<string, mixed>
     */
    protected array $request_classes = [
        'employee_request' => [
            'class' => 'DemoPlugin\Requests\EmployeeRequest',
            'args'  => [],
        ],
        'salary_history_request' => [
            'class' => 'DemoPlugin\Requests\SalaryHistoryRequest',
            'args'  => [],
        ],
    ];

    /**
     * All the API classes.
     *
     * @var array|string[]
     */
    protected array $api_classes = [
        'DemoPlugin\REST\DepartmentApi',
        'DemoPlugin\REST\DesignationApi',
        'DemoPlugin\REST\SalaryHeadApi',
        'DemoPlugin\REST\PayrollApi',
        'DemoPlugin\REST\EmployeeApi',
        'DemoPlugin\REST\PaySlipApi',
        'DemoPlugin\REST\DashboardApi',
    ];

    /**
     * Holds classes instances
     *
     * @var array<string, mixed>
     */
    private array $container = [];

    /**
     * Get the single instance of the class
     *
     * @since PLUGIN_NAME_VERSION
     * @return DemoPlugin
     */
    public static function get_instance(): DemoPlugin {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Construct method for PayCheckMate class.
     */
    private function __construct() {
        add_action( 'init', [ $this, 'set_translation' ] );
        register_activation_hook( PAY_CHECK_MATE_FILE, [ $this, 'activate_this_plugin' ] );
        add_action( 'plugins_loaded', [ $this, 'load_plugin_hooks' ] );

        // Register REST API routes.
        add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );
    }

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @param string $prop Property name.
     *
     * @return mixed
     */
    public function __get( string $prop ) {
        if ( array_key_exists( $prop, $this->container ) ) {
            return $this->container[ $prop ];
        }

        return $this->{$prop};
    }

    /**
     * Set Transaction Text Domain
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function set_translation(): void {
        load_plugin_textdomain( 'plugin-name', false, dirname( plugin_basename( PAY_CHECK_MATE_FILE ) ) . '/languages' );
    }

    /**
     * On activate this plugin.
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function activate_this_plugin(): void {
        if ( ! get_option( 'pay_check_mate_installed' ) ) {
            update_option( 'pay_check_mate_installed', time() );
        }

        update_option( 'pay_check_mate_version', PAY_CHECK_MATE_PLUGIN_VERSION );

        new Installer();

        flush_rewrite_rules();
    }

    /**
     * Main point of loading the plugin.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws \ReflectionException
     *
     * @return void
     */
    public function load_plugin_hooks(): void {
        // Check option that all tables are created for this version.
        $tables_created = get_option( 'pay_check_mate_tables_created', false );
        if ( ! $tables_created || version_compare( $tables_created, PAY_CHECK_MATE_PLUGIN_VERSION, '<' ) ) {
            new Installer();
        }

        $this->load_hook_classes();
        $this->load_classes( $this->classes );
        $this->load_classes( $this->model_classes );
        $this->load_classes( $this->request_classes );

        do_action( 'pay_check_mate_loaded' );
    }

    /**
     * Load all the hook classes.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return void
     */
    public function load_hook_classes() {
        if ( empty( $this->hook_classes ) ) {
            return;
        }

        foreach ( $this->hook_classes as $item ) {
            $item = new $item();
            if ( $item instanceof HookAbleInterface ) {
                $this->load_hooks( $item );
            }
        }
    }

    /**
     * Load all the classes.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param array<string, mixed> $classes Classes to load.
     *
     * @throws \ReflectionException
     * @return void
     */
    public function load_classes( array $classes = [] ) {
        if ( empty( $classes ) ) {
            return;
        }

        foreach ( $classes as $key => $item ) {
            $reflector = new ReflectionClass( $item['class'] );
            if ( isset( $item['args'] ) ) {
                $instance = $reflector->newInstanceArgs( $item['args'] );
            } else {
                $instance = $reflector->newInstance();
            }

            $this->container[ $key ] = $instance;
        }
    }

    /**
     * Register REST API routes.
     *
     * @since PLUGIN_NAME_VERSION
     * @return void
     */
    public function register_rest_routes(): void {
        if ( empty( $this->api_classes ) ) {
            return;
        }

        foreach ( $this->api_classes as $item ) {
            $item = new $item();
            if ( $item instanceof HookAbleApiInterface ) {
                $item->register_api_routes();
            }
        }
    }

    /**
     * Load necessary hooks.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param HookAbleInterface $hook_able HookAble Interface.
     *
     * @return void
     */
    private function load_hooks( HookAbleInterface $hook_able ): void {
        $hook_able->hooks();
    }
}
