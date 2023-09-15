<?php

namespace PayCheckMate;

use PayCheckMate\Classes\Installer;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Contracts\HookAbleInterface;
use ReflectionClass;

final class PayCheckMate {

    /**
     * @var PayCheckMate|null
     */
    protected static ?PayCheckMate $instance = null;

    /**
     * All the hook classes.
     *
     * @var array|string[]
     */
    protected array $hook_classes = [
        'PayCheckMate\Hooks\AdminMenu',
        'PayCheckMate\Hooks\Assets',
        'PayCheckMate\Hooks\User',
    ];

    /**
     * All the controller classes.
     *
     * @var array<string, mixed>
     */
    protected array $classes = [
        'employee' => [
            'class' => 'PayCheckMate\Classes\Employee',
        ],
    ];

    /**
     * All the model classes.
     *
     * @var array<string, mixed>
     */
    protected array $model_classes = [
        'employee_model' => [
            'class' => 'PayCheckMate\Models\EmployeeModel',
        ],
        'salary_history_model' => [
            'class' => 'PayCheckMate\Models\SalaryHistoryModel',
        ],
    ];

    /**
     * All the request classes.
     *
     * @var array<string, mixed>
     */
    protected array $request_classes = [
        'employee_request' => [
            'class' => 'PayCheckMate\Requests\EmployeeRequest',
            'args'  => [],
        ],
        'salary_history_request' => [
            'class' => 'PayCheckMate\Requests\SalaryHistoryRequest',
            'args'  => [],
        ],
    ];

    /**
     * All the API classes.
     *
     * @var array|string[]
     */
    protected array $api_classes = [
        'PayCheckMate\REST\DepartmentApi',
        'PayCheckMate\REST\DesignationApi',
        'PayCheckMate\REST\SalaryHeadApi',
        'PayCheckMate\REST\PayrollApi',
        'PayCheckMate\REST\EmployeeApi',
        'PayCheckMate\REST\PaySlipApi',
        'PayCheckMate\REST\DashboardApi',
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
     * @since PAY_CHECK_MATE_SINCE
     * @return PayCheckMate
     */
    public static function get_instance(): PayCheckMate {
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
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function set_translation(): void {
        load_plugin_textdomain( 'pay-check-mate', false, dirname( plugin_basename( PAY_CHECK_MATE_FILE ) ) . '/languages' );
    }

    /**
     * On activate this plugin.
     *
     * @since PAY_CHECK_MATE_SINCE
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
     * @since PAY_CHECK_MATE_SINCE
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
     * @since PAY_CHECK_MATE_SINCE
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
     * @since PAY_CHECK_MATE_SINCE
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
     * @since PAY_CHECK_MATE_SINCE
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
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param HookAbleInterface $hook_able HookAble Interface.
     *
     * @return void
     */
    private function load_hooks( HookAbleInterface $hook_able ): void {
        $hook_able->hooks();
    }
}
