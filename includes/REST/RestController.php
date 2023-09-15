<?php

namespace PayCheckMate\REST;

use WP_REST_Controller;
use WP_REST_Response;

class RestController extends WP_REST_Controller {


    /**
     * Prepare the item for the REST response.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param object                          $item    Default item object.
     *
     * @param \WP_REST_Request<array<string>> $request Request object.
     *
     * @return \WP_Error|\WP_REST_Response
     */
    public function prepare_item_for_response( $item, $request ) {
        $data   = [];
        $fields = $this->get_fields_for_response( $request );

        $schema = $this->get_item_schema();
        foreach ( $schema['properties'] as $key => $value ) {
            if ( ! in_array( $key, $fields, true ) ) {
                continue;
            }

            $data[ $key ] = $item->{$key} ?? '';
        }

        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data    = $this->add_additional_fields_to_object( $data, $request );
        $data    = $this->filter_response_by_context( $data, $context );

        // Wrap the data in a response object.
        $response = rest_ensure_response( $data );

        $response->add_links( $this->prepare_links( $item ) );

        return $response;
    }

    /**
     * Prepare links for the request.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param object $item Item object.
     *
     * @return array<string,array<string,string>> Links for the given post.
     */
    protected function prepare_links( object $item ): array {
        $base = sprintf( '%s/%s', $this->namespace, $this->rest_base );

        return [
            'self'       => [
                'href' => rest_url( trailingslashit( $base ) . $item->id ),
            ],
            'collection' => [
                'href' => rest_url( $base ),
            ],
        ];
    }

    /**
     * Prepare a response for inserting into a collection of responses.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Response $response Response object.
     *
     * @return array<string,array<string,string>>|WP_REST_Response Response data, ready for insertion into collection data.
     */
    public function prepare_response_for_collection( $response ) {
        if ( ! ( $response instanceof WP_REST_Response ) ) {
            return $response;
        }

        $data   = (array) $response->get_data();
        $server = rest_get_server();

        if ( method_exists( $server, 'get_compact_response_links' ) ) {
            $links = call_user_func( [ $server, 'get_compact_response_links' ], $response );
        } else {
            $links = call_user_func( [ $server, 'get_response_links' ], $response );
        }

        if ( ! empty( $links ) ) {
            $data['_links'] = $links;
        }

        return $data;
    }

    /**
     * Get the query params for collections.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string,array<string,string|bool|int>> Collection parameters.
     */
    public function get_collection_params(): array {
        return [
            'search'   => [
                'description'       => __( 'Limit results to those matching a string.', 'pcm' ),
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => 'rest_validate_request_arg',
                'default'           => '',
            ],
            'page'     => [
                'description'       => __( 'Current page of the collection.', 'pcm' ),
                'type'              => 'integer',
                'sanitize_callback' => 'absint',
                'validate_callback' => 'rest_validate_request_arg',
                'default'           => 1,
                'minimum'           => 1,
                'maximum'           => PHP_INT_MAX,
            ],
            'per_page' => [
                'description'       => __( 'Maximum number of items to be returned in result set.', 'pcm' ),
                'type'              => 'integer',
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => 'rest_validate_request_arg',
                'default'           => 10,
                'minimum'           => - 1,
                'maximum'           => 100,
            ],
            'order_by'  => [
                'description'       => __( 'Sort collection by object attribute.', 'pcm' ),
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_key',
                'validate_callback' => 'rest_validate_request_arg',
                'default'           => 'id',
            ],
            'order'    => [
                'description'       => __( 'Order sort attribute ascending or descending.', 'pcm' ),
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_key',
                'validate_callback' => 'rest_validate_request_arg',
                'default'           => 'desc',
            ],
            'status'   => [
                'description'       => __( 'Limit result set to items with a specific status.', 'pcm' ),
                'type'              => 'string',
                'sanitize_callback' => 'absint',
                'validate_callback' => 'rest_validate_request_arg',
            ],
        ];
    }
}
