<?php

namespace DemoPlugin\Requests;

use Exception;
use DemoPlugin\Contracts\FormRequestInterface;

class Request implements FormRequestInterface {

    // Here we will check nonce, validate data and fill the model.

    /**
     * Nonce property.
     *
     * @var string
     */
    protected static string $nonce;

    /**
     * Rules for request validation.
     *
     * @var array<string>
     */
    protected static array $rules;

    /**
     * All the fillable.
     *
     * @var array<string>
     */
    protected static array $fillable;

    /**
     * Post property.
     *
     * @var array<string>
     */
    public array $data;

    /**
     * Any error.
     *
     * @var string[]|null
     */
    public ?array $error = [];

    /**
     * Construct method for SupportFormStoreRequest class.
     * This will get a $_POST Super Global as an argument.
     *
     * @param array<string> $data Post Super Global.
     *
     * @throws Exception
     */
    public function __construct( array $data = [] ) {
        $this->data = $data;
        if ( empty( $this->data ) ) {
            return;
        }

        $this->validate();
    }

    /**
     * To get data like $request->title dynamically, we introduced this magic method.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param string $name property name.
     *
     * @return string|null
     */
    public function __get( string $name ) {
        return $this->data[ $name ] ?? null;
    }

    /**
     * Set data.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param array<string> $data Post Super Global.
     *
     * @throws \Exception
     * @return $this
     */
    public function set( array $data ): Request {
        $this->data = $data;
        $this->validate();

        return $this;
    }

    /**
     * Set data.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param string $key   Key name.
     * @param mixed  $value Value.
     *
     * @throws \Exception
     * @return $this
     */
    public function set_data( string $key, $value ): Request {
        $this->data[ $key ] = $value;
        $this->validate();

        return $this;
    }

    /**
     * Validate nonce.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws Exception
     *
     * @return void
     */
    public function validate() {
        if ( ! isset( $this->data['_wpnonce'] ) || ! wp_verify_nonce( $this->data['_wpnonce'], $this->get_nonce() ) ) {
            $this->addError( 'nonce', __( 'Nonce verification failed', 'plugin-name' ) );

            wp_die( __( 'Nonce verification failed', 'plugin-name' ) );
			// throw new Exception( __( 'Nonce verification failed', 'plugin-name' ) );
        }

        $this->validate_fillable();
        $this->sanitize();
    }

    /**
     * Validate fillable.
     *
     * @since PLUGIN_NAME_VERSION
     * @throws Exception
     * @return void
     */
    public function validate_fillable() {
        $fillable = $this->get_fillable();
        if ( ! empty( $fillable ) ) {
            foreach ( $fillable as $item ) {
                if ( ! array_key_exists( $item, $this->data ) ) {
                    $this->addError( $item, $item . __( ' key is required for this form request.', 'plugin-name' ) );
                }

                // Check if this key value is empty.
                if ( '' === $this->data[ $item ] && empty( $this->data[ $item ] ) ) {
                    $this->addError( $item, $item . __( ' key can not be empty.', 'plugin-name' ) );
                }
            }
        }
    }

    /**
     * Sanitize data.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws Exception
     * @return void
     */
    public function sanitize() {
        $rules = $this->get_rules();
        array_map(
            function ( $value, $key ) use ( $rules ) {
                if ( isset( $rules[ $key ] ) ) {
                    $this->data[ $key ] = call_user_func( $rules[ $key ], $value );

                    return $this->data;
                }

                $this->data[ $key ] = $value;

                return $this->data;
            }, $this->data, array_keys( $this->data )
        );
    }

    /**
     * Convert to array.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return array<string>
     */
    public function to_array(): array {
        return $this->data;
    }

    /**
     * Add error.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param string $error Error message.
     *
     * @return void
     */
    public function addError( string $key, string $error ) {
        $this->error[ $key ] = $error;
    }

    /**
     * Get nonce.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws Exception
     *
     * @return string
     */
    public static function get_nonce(): string {
        if ( empty( static::$nonce ) ) {
            throw new Exception( __( 'Nonce is not defined for this form request.', 'plugin-name' ) );
        }

        return static::$nonce;
    }

    /**
     * Get rules.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws Exception
     *
     * @return array<string>
     */
    public static function get_rules(): array {
        if ( empty( static::$rules ) ) {
            throw new Exception( __( 'Make sure you have defined rules for this form request.', 'plugin-name' ) );
        }

        return static::$rules;
    }

    /**
     * Get fillable.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @throws Exception
     *
     * @return array<string>
     */
    public static function get_fillable(): array {
        if ( empty( static::$fillable ) ) {
            throw new Exception( __( 'Fillable are not defined for this form request.', 'plugin-name' ) );
        }

        return static::$fillable;
    }
}
