<?php

namespace PayCheckMate\REST;

use PayCheckMate\REST\RestController;
use WP_Error;
use Exception;
use WP_REST_Request;
use WP_REST_Response;
use PayCheckMate\Requests\DepartmentRequest;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\DepartmentModel;

class DepartmentApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'departments';
    }


    /**
     * Register the necessary Routes.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace, '/' . $this->rest_base, [
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'args'                => $this->get_collection_params(),
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			],
        );

        register_rest_route(
            $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [
						'id' => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
					],
				],
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => [
						'id'              => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
						'name' => [
							'description' => __( 'Department name.', 'pcm' ),
							'type'        => 'string',
							'required'    => true,
						],
						'status'          => [
							'description' => __( 'Department status.', 'pcm' ),
							'type'        => 'integer',
						],
					],
				],
				[
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => [
						'id' => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
					],
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			],
        );
    }

    /**
     * Check if a given request has access to get items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @return bool
     */
    public function get_items_permissions_check( $request ): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' ) || current_user_can( 'pay_check_mate_employee' );
    }

    /**
     * Check if a given request has access to create items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @return bool
     */
    public function create_item_permissions_check( $request ): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Check if a given request has access to get a specific item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @return bool
     */
    public function get_item_permissions_check( $request ): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Check if a given request has access to update a specific item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @return bool
     */
    public function update_item_permissions_check( $request ): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Check if a given request has access to delete a specific item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @return bool
     */
    public function delete_item_permissions_check( $request ): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Get a collection of items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @throws \Exception
     *
     * @return WP_REST_Response
     */
    public function get_items( $request ): WP_REST_Response {
        $args = [
            'limit'   => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 10,
            'offset'  => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'   => $request->get_param( 'order' ) ? $request->get_param( 'order' ) : 'ASC',
            'order_by' => $request->get_param( 'order_by' ) ? $request->get_param( 'order_by' ) : 'id',
            'status'  => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : 'all',
            'search'   => $request->get_param( 'search' ) ? $request->get_param( 'search' ) : '',
        ];

        $department = new DepartmentModel();
        $departments = $department->all( $args );
        $data        = [];

        foreach ( $departments as $item ) {
            $item   = $this->prepare_item_for_response( $item, $request );
            $data[] = $this->prepare_response_for_collection( $item );
        }

        $total     = $department->count( $args );
        $max_pages = ceil( $total / (int) $args['limit'] );

        $response = new WP_REST_Response( $data );

        $response->header( 'X-WP-Total', (string) $total );
        $response->header( 'X-WP-TotalPages', (string) $max_pages );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @throws Exception
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function create_item( $request ) {
        $department     = new DepartmentModel();
        $validated_data = new DepartmentRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        $department = $department->create( $validated_data );

        if ( is_wp_error( $department ) ) {
            return new WP_Error( 500, __( 'Could not create department.', 'pcm' ) );
        }

        $department = $this->prepare_item_for_response( $department, $request );
        $department = $this->prepare_response_for_collection( $department );
        $response = new WP_REST_Response( $department );
        $response->set_status( 201 );

        return new WP_REST_Response( $response, 201 );
    }

    /**
     * Get one item from the collection.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @throws \Exception
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_item( $request ) {
        $department = new DepartmentModel();
        $department = $department->find( $request->get_param( 'id' ) );

        if ( is_wp_error( $department ) ) {
            return new WP_Error( 404, $department->get_error_message(), [ 'status' => 404 ] );
        }

        if ( ! empty( (array) $department ) ) {
            $item = $this->prepare_item_for_response( $department, $request );
            $data = $this->prepare_response_for_collection( $item );
        } else {
            $data = [];
        }

        return new WP_REST_Response( $data, 200 );
    }

    /**
     * Update one item from the collection.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @throws Exception
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function update_item( $request ) {
        $department     = new DepartmentModel();
        $validated_data = new DepartmentRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        $updated = $department->update( $request->get_param( 'id' ), $validated_data );
        if ( is_wp_error( $updated ) ) {
            return new WP_Error( 500, $updated->get_error_message(), [ 'status' => 500 ] );
        }

        $department = $department->find( $request->get_param( 'id' ) );
        $item        = $this->prepare_item_for_response( $department, $request );
        $data        = $this->prepare_response_for_collection( $item );
        $response = new WP_REST_Response( $data );
        $response->set_status( 201 );

        return new WP_REST_Response( $response, 201 );
    }

    /**
     * Delete one item from the collection.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function delete_item( $request ) {
        $department = new DepartmentModel();
        try {
            $department = $department->delete( $request->get_param( 'id' ) );
        } catch ( Exception $e ) {
            return new WP_Error( 500, __( 'Could not delete designation.', 'pcm' ) );
        }

        if ( ! $department ) {
            return new WP_Error( 500, __( 'Could not delete designation.', 'pcm' ) );
        }

        return new WP_REST_Response( $department, 200 );
    }

    /**
     * Get the query params for collections. These are query params that are used for every collection request.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, array<string, array<string, array<int, string>|bool|string>>|string> Collection parameters.
     */
    public function get_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'department',
            'type'       => 'object',
            'properties' => [
                'id'              => [
                    'description' => __( 'Unique identifier for the object', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'name' => [
                    'description' => __( 'Department name', 'pcm' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'status'          => [
                    'description' => __( 'Status', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'created_on'      => [
                    'description' => __( 'Created on', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'updated_at'      => [
                    'description' => __( 'Updated on', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
            ],
        ];
    }
}
