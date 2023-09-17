# Wordpress Plugin Template
A fresh WordPress plugin template

## Installation
1. Clone this repository into your WordPress plugins folder
2. Rename the folder to your plugin name
3. Run `npm install` to install all dependencies
4. Run `npm run new-wp` and follow the instructions to replace all instances of `plugin-template` with your plugin name

Video tutorial: [Click here](https://www.youtube.com/watch?v=4ULxW7nqyKU)

## Development
See package.json for available scripts

## Use of Model
Here is an example of how to use the Model class:

```php
<?php

namespace DemoPlugin\Models;

class PostModel extends Model {

    /**
     * The table associated with the model.
     *
     * @since  1.0.0
     *
     * @var string
     *
     * @access protected
     */
    protected static string $table = 'posts';

    /**
     * By which column the table should be searched
     *
     * @var array|string[] $search_by
     */
    protected static array $search_by = [ 'post_title', 'post_content' ];

    /**
     * Columns of the table with their type
     *
     * @var array|string[] $columns
     */
    protected static array $columns = [
        'post_author'  => '%d',
        'post_title'   => '%s',
        'post_content' => '%s',
        'post_status'  => '%s',
        'post_type'    => '%s',
    ];

    /**
     * Make crated on mutation
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return string
     */
    public function set_created_on(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Make updated at mutation
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @return string
     */
    public function set_updated_at(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Get created at mutated date.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param string $date
     *
     * @return string
     */
    public function get_created_on( string $date ): string {
        return get_date_from_gmt( $date, 'd M Y' );
    }

}
```

## Use of Request
Here is an example of how to use the Request class:

```php
<?php

namespace DemoPlugin\Requests;

class PostRequest extends Request {

    /**
     * The nonce for the request.
     */
    protected static string $nonce = 'plugin_name_nonce';

    /**
     * Fillable fields for the request.
     */
    protected static array $fillable = [ 'post_title', 'post_content', 'post_status' ];

    /**
     * Rules by which the request should be validated.
     */
    protected static array $rules = [
        'post_author'  => 'absint',
        'post_title'   => 'sanitize_text_field',
        'post_content' => 'wp_kses_post',
        'post_status'  => 'sanitize_text_field',
        'post_type'    => 'sanitize_text_field',
    ];
}
```

## Use of Model and Request together
Here is an example of how to use the Model and Request class together:

```php
<?php

    /**
     * Get a collection of items.
     *
     * @since PLUGIN_NAME_VERSION
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
            'where'   => [
                'post_type' => 'post',
            ],
            'relations' => [
                [
                    'table'       => UserModel::get_table(),
                    'local_key'   => 'post_author',
                    'foreign_key' => 'ID',
                    'join_type'   => 'left',
                    'fields'      => [
                        'user_name',
                    ],
                ],
            ]
        ];

        $postModel = new PostModel();
        $posts = $postModel->all( $args );
        $data        = [];
        foreach ( $posts as $item ) {
            $item   = $this->prepare_item_for_response( $item, $request );
            $data[] = $this->prepare_response_for_collection( $item );
        }

        $total     = $postModel->count( $args );
        $max_pages = ceil( $total / (int) $args['limit'] );

        $response = new WP_REST_Response( $data );

        $response->header( 'X-WP-Total', (string) $total );
        $response->header( 'X-WP-TotalPages', (string) $max_pages );

        return new WP_REST_Response( $response, 200 );
    }


```

If you want to insert a new item using Base Model, you need to validate data through Request class. Here is an example of how to do it:

```php
<?php

    /**
     * Create a single item.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @throws \Exception
     *
     * @return WP_REST_Response
     */
    public function create_item( $request ): WP_REST_Response {
        $validData = new PostRequest( $request->get_params() );
        if ( ! empty($validData->error) ){
            wp_send_json_error( $validData->error );
        }

        $postModel = new PostModel();
        $postModel->create( $validData );

        $item = $this->prepare_item_for_response( $postModel, $validData );

        return new WP_REST_Response( $item, 201 );
    }
```
