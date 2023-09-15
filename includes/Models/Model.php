<?php

namespace PayCheckMate\Models;

use Exception;
use PayCheckMate\Contracts\ModelInterface;
use PayCheckMate\Requests\Request;
use WP_Error;

/**
 * Base Model for all the models to extend with Late Static Binding.
 */
class Model implements ModelInterface {

    protected static string $table_prefix = 'pay_check_mate_';
    protected string $cache_group = 'pay_check_mate_';

    public function __construct() {
        $this->cache_group = $this->cache_group . static::$table;
    }

    /**
     * The table associated with the model.
     *
     * @since  1.0.0
     *
     * @var string
     *
     * @access protected
     * @abstract
     */
    protected static string $table;

    /**
     * @var array|string[] $columns
     */
    protected static array $columns;

    protected static string $find_key = 'id';

    // @phpstan-ignore-next-line
    protected static array $mutation_fields = [];
    // @phpstan-ignore-next-line
    protected static array $additional_logical_data = [];

    // @phpstan-ignore-next-line
    protected static array $search_by = [];

    /**
     * @var mixed
     */
    public $data = [];

    /**
     * Get all the items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     *                                            - 'status'    => int,
     *                                            - 'limit'     => string|int,
     *                                            - 'order'     => 'ASC',
     *                                            - 'order_by'   => string,
     *                                            - 'mutation_fields' => ['string'], this will call get_{field_name} method
     *                                            - 'relations' => [
     *                                            [
     *                                            'table'       => '{RELATION_TABLE_NAME}',
     *                                            'local_key'   => '{{RELATION_TABLE_LOCAL_KEY}',
     *                                            'foreign_key' => '{CURRENT_TABLE_FOREIGN_KEY}',
     *                                            'join_type'   => '{JOIN_TYPE}',
     *                                            'where'       => [
     *                                            '{FIELD}' => [
     *                                            'operator' => '{OPERATOR}',
     *                                            'value'    => {VALUE},
     *                                            ],
     *                                            ],
     *                                            'fields'      => [
     *                                            '{FIELD_NAME}',
     *                                            ],
     *                                            ],
     *                                            // Add more relations if needed
     *                                            ],
     * @param string[]             $fields
     * @param array<string, mixed> $additional_logical_data
     *
     * @throws \Exception
     * @return array<object>
     */
    public function all( array $args, array $fields = [ '*' ], array $additional_logical_data = [] ): array {
        global $wpdb;
        $args = wp_parse_args(
            $args, [
                'limit'     => 20,
                'offset'    => 0,
                'order'     => 'DESC',
                'order_by'  => 'id',
                'search'    => '',
                'status'    => 'all',
                'group_by'  => '',
                'relations' => [],
            ]
        );

        // Add caching.
        $cache_key = md5( wp_json_encode( $args ) . wp_json_encode( $fields ) . wp_json_encode( $additional_logical_data ) );
        $cache     = wp_cache_get( $cache_key, $this->cache_group );
        if ( false !== $cache ) {
            $this->data = $cache;
            return $this->data;
        }

        if ( ! empty( $args['mutation_fields'] ) ) {
            static::$mutation_fields = $args['mutation_fields'];
            unset( $args['mutation_fields'] );
        }

        if ( ! empty( $additional_logical_data ) ) {
            static::$additional_logical_data = $additional_logical_data;
        }

        $relations         = '';
        $where             = 'WHERE 1=1';
        $relational_fields = [];
        if ( ! empty( $args['relations'] ) ) {
            // Get relational and where clause from get_relations() method.
            $relational        = $this->get_relational( $args );
            $relations         = $relational->relations;
            $where             = $relational->where;
            $relational_fields = $relational->fields;
        }

        if ( ! empty( $args['where'] ) ) {
            foreach ( $args['where'] as $key => $value ) {
                $type  = ! empty( $value['type'] ) ? $value['type'] : 'AND';
                $where .= $wpdb->prepare( " {$type} {$this->get_table()}.{$key} {$value['operator']} %s", $value['value'] );
            }
        }

        if ( ! empty( $args['where_between'] ) ) {
            foreach ( $args['where_between'] as $key => $value ) {
                $type  = ! empty( $value['type'] ) ? $value['type'] : 'AND';
                $where .= $wpdb->prepare( " {$type} {$this->get_table()}.{$key} BETWEEN %s AND %s", $value['start'], $value['end'] );
            }
        }

        if ( ! empty( $args['status'] ) && 'all' !== $args['status'] ) {
            $where .= $wpdb->prepare( " AND {$this->get_table()}.status = %d", $args['status'] );
        }

        if ( ! empty( $args['search'] ) ) {
            $where .= $this->get_search_query( $args['search'] );
        }

        $group_by = '';
        if ( ! empty( $args['group_by'] ) ) {
            $group_by = $wpdb->prepare( 'GROUP BY %s', $args['group_by'] );
        }

        // Add table name as prefix and esc_sql the fields for the base table.
        foreach ( $fields as $key => $field ) {
            $fields[ $key ] = $this->get_table() . '.' . esc_sql( $field );
        }

        $relational_fields = array_merge( ...$relational_fields );
        $fields            = array_merge( $fields, $relational_fields );
        $fields            = implode( ', ', esc_sql( $fields ) );
        if ( '-1' === "$args[limit]" ) {
            $query = $wpdb->prepare(
                "SELECT $fields FROM {$this->get_table()} {$relations} {$where} {$group_by} ORDER BY {$this->get_table()}.{$args['order_by']} {$args['order']}",
            );
        } else {
            $query = $wpdb->prepare(
                "SELECT $fields FROM {$this->get_table()} {$relations} {$where} {$group_by} ORDER BY {$this->get_table()}.{$args['order_by']} {$args['order']} LIMIT %d OFFSET %d",
                $args['limit'],
                $args['offset']
            );
        }

        $results    = $wpdb->get_results( $query );
        $this->data = $this->process_items( $results );
        wp_cache_set( $cache_key, $this->data, $this->cache_group );

        return $this->data;
    }

    /**
     * Get relational and where clause from get_relations() method.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<array<string, mixed>> $args
     *
     * @throws \Exception
     * @return object
     */
    public function get_relational( array $args = [] ): object {
        global $wpdb;

        $where             = 'WHERE 1=1';
        $relations         = '';
        $relational_fields = [];

        foreach ( $args['relations'] as $relation ) {
            if ( empty( $relation['join_type'] ) ) {
                $relation['join_type'] = 'INNER';
            }

            // Add table prefix on the table name.
            $relations         .= " {$relation['join_type']} JOIN {$relation['table']} ON {$relation['table']}.{$relation['foreign_key']} = {$this->get_table()}.{$relation['local_key']}";

            if ( ! empty( $relation['where'] ) ) {
                foreach ( $relation['where'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} {$value['operator']} %s", $value['value'] );
                }
            }

            if ( ! empty( $relation['select_max'] ) ) {
                foreach ( $relation['select_max'] as $key => $value ) {
                    $subquery = $wpdb->prepare( "SELECT MAX({$key}) FROM {$relation['table']} WHERE {$value['compare']['key']} {$value['compare']['operator']} '{$value['compare']['value']}' AND {$relation['table']}.{$relation['foreign_key']} = {$this->get_table()}.{$relation['local_key']}", );
                    $where    .= $wpdb->prepare( " AND {$relation['table']}.{$key} = ({$subquery})", );
                }
            }

            if ( ! empty( $relation['where_in'] ) ) {
                foreach ( $relation['where_in'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} IN (%s)", $value );
                }
            }

            if ( ! empty( $relation['where_not_in'] ) ) {
                foreach ( $relation['where_not_in'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} NOT IN (%s)", $value );
                }
            }

            if ( ! empty( $relation['where_like'] ) ) {
                foreach ( $relation['where_like'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} LIKE %s", $value );
                }
            }

            if ( ! empty( $relation['where_not_like'] ) ) {
                foreach ( $relation['where_not_like'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} NOT LIKE %s", $value );
                }
            }

            if ( ! empty( $relation['where_between'] ) ) {
                foreach ( $relation['where_between'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} BETWEEN %s AND %s", $value );
                }
            }

            if ( ! empty( $relation['where_not_between'] ) ) {
                foreach ( $relation['where_not_between'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} NOT BETWEEN %s AND %s", $value );
                }
            }

            if ( ! empty( $relation['fields'] ) ) {
                $relational_fields[] = array_map(
                    function ( $field ) use ( $relation ) {
                        return $relation['table'] . '.' . esc_sql( $field );
                    }, $relation['fields']
                );
            }
        }

        // Return relations and where.
        return (object) [
            'relations' => $relations,
            'where'     => $where,
            'fields'    => $relational_fields,
        ];
    }

    /**
     * Get the total number of items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     *
     * @throws Exception
     * @return int
     */
    public function count( array $args = [] ): int {
        global $wpdb;
        $args = wp_parse_args(
            $args, [
                'status' => '',
                'search' => '',
            ]
        );

        $where = 'WHERE 1=1';
        if ( ! empty( $args['status'] ) && 'all' !== $args['status'] ) {
            $where .= $wpdb->prepare( ' AND status = %d', $args['status'] );
        }

        if ( ! empty( $args['search'] ) ) {
            $where .= $this->get_search_query( $args['search'] );
        }

        // As we prepared the where clause before, we can directly use it.
        $query = "SELECT COUNT(*) FROM {$this->get_table()} {$where}";

        return $wpdb->get_var( $query );
    }

    /**
     * Get the search query.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $search
     *
     * @throws \Exception
     * @return string|WP_Error
     */
    public function get_search_query( string $search ) {
        if ( empty( static::$search_by ) ) {
            return new WP_Error( 'search_by_not_defined', __( 'To search, you need to define the search_by property in the model.', 'pcm' ) );
        }

        global $wpdb;
        $where = ' AND (';
        foreach ( static::$search_by as $key => $value ) {
            if ( $key === 0 ) {
                $where .= $wpdb->prepare( "{$this->get_table()}.{$value} LIKE %s", '%' . $search . '%' );
            } else {
                $where .= $wpdb->prepare( " OR {$this->get_table()}.{$value} LIKE %s", '%' . $search . '%' );
            }
        }
        $where .= ')';

        return $where;
    }

    /**
     * Get the item from the database.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int           $id
     * @param array<string> $args
     *
     *
     * @throws \Exception
     * @return object
     */
    public function find( int $id, array $args = [] ): object {
        global $wpdb;
        $args = wp_parse_args(
            $args, [
                'fields' => [ '*' ],
            ]
        );

        // Add caching.
        $cache_key = md5( $id . wp_json_encode( $args ) );
        $cache     = wp_cache_get( $cache_key, $this->cache_group );
        if ( false !== $cache ) {
            $this->data = $cache;
            return $this->data;
        }

        if ( $args['fields'][0] === '*' ) {
            $args['fields'] = [ $this->get_table() . '.*' ];
        }
        $fields            = $args['fields'];
        $relational_fields = [];
        $relations         = '';
        $where             = 'WHERE 1=1';
        if ( ! empty( $args['relations'] ) ) {
            // Get relational and where clause from get_relations() method.
            $relational        = $this->get_relational( $args );
            $relations         = $relational->relations;
            $where             = $relational->where;
            $relational_fields = $relational->fields;
        }
        $relational_fields = array_merge( ...$relational_fields );
        $fields            = array_merge( $fields, $relational_fields );
        $fields            = implode( ', ', esc_sql( $fields ) );
        $query             = $wpdb->prepare( "SELECT {$fields} FROM {$this->get_table()} {$relations} {$where} AND {$this->get_table()}.{$this->get_find_key()} = %d", $id );
        $results           = $wpdb->get_row( $query );

        if ( empty( $results ) ) {
            return (object) [];
        }

        $this->data = $this->process_item( $results );
        wp_cache_set( $cache_key, $this->data, $this->cache_group );

        return $this->data;
    }

    /**
     * Get the items from the database by.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, string> $find_by
     * @param array<string>         $args
     * @param array<string>         $fields
     *
     * @throws \Exception
     * @return array<object>
     */
    public function find_by( array $find_by, array $args, array $fields = [ '*' ] ): array {
        global $wpdb;
        if ( empty( $find_by ) ) {
            throw new \Exception( __( 'Arguments cannot be empty', 'pcm' ) );
        }

        $args = wp_parse_args(
            $args, [
                'order_by' => 'id',
                'order'    => 'DESC',
                'limit'    => 1,
                'offset'   => 0,
                'status'   => 'all',
            ]
        );

        // Add caching.
        $cache_key = md5( wp_json_encode( $args ) . wp_json_encode( $fields ) . wp_json_encode( $find_by ) );
        $cache     = wp_cache_get( $cache_key, $this->cache_group );
        if ( false !== $cache ) {
            $this->data = $cache;
            return $this->data;
        }

        if ( ! empty( $args['order_by'] ) ) {
            $args['order_by'] = $this->get_table() . '.' . $args['order_by'];
        }

        $where = 'WHERE 1=1';
        if ( ! empty( $args['where'] ) ) {
            foreach ( $args['where'] as $key => $value ) {
                $type  = ! empty( $value['type'] ) ? $value['type'] : 'AND';
                $where .= $wpdb->prepare( " {$type} {$this->get_table()}.{$key} {$value['operator']} %s", $value['value'] );
            }
        }

        if ( ! empty( $args['where_between'] ) ) {
            foreach ( $args['where_between'] as $key => $value ) {
                $type  = ! empty( $value['type'] ) ? $value['type'] : 'AND';
                $where .= $wpdb->prepare( " {$type} {$this->get_table()}.{$key} BETWEEN %s AND %s", $value['start'], $value['end'] );
            }
        }

        if ( isset( $args['status'] ) && 'all' !== $args['status'] ) {
            $where .= $wpdb->prepare( " AND {$this->get_table()}.status = %d", $args['status'] );
        }

        $relational_fields = [];
        $relations         = '';
        if ( ! empty( $args['relations'] ) ) {
            // Get relational and where clause from get_relations() method.
            $relational        = $this->get_relational( $args );
            $relations         = $relational->relations;
            $where             = $relational->where;
            $relational_fields = $relational->fields;
        }

        foreach ( $find_by as $key => $value ) {
            $where .= $wpdb->prepare( " AND {$this->get_table()}.{$key} = %s", $value );
        }

        $relational_fields = array_merge( ...$relational_fields );
        $fields            = array_map( function ( $field ) {
            return $this->get_table() . '.' . esc_sql( $field );
        }, $fields );
        $fields            = array_merge( $fields, $relational_fields );
        $fields            = implode( ', ', esc_sql( $fields ) );

        $group_by = '';
        if ( ! empty( $args['group_by'] ) ) {
            $group_by = $wpdb->prepare( 'GROUP BY %s', $args['group_by'] );
        }

        if ( '-1' === "$args[limit]" ) {
            $query = "SELECT {$fields} FROM {$this->get_table()} {$relations} {$where} {$group_by} ORDER BY {$args['order_by']} {$args['order']} ";
        } else {
            $query = $wpdb->prepare( "SELECT {$fields} FROM {$this->get_table()} {$relations} {$where} {$group_by} ORDER BY {$args['order_by']} {$args['order']} LIMIT %d OFFSET %d", $args['limit'], $args['offset'] );
        }

        $results = $wpdb->get_results( $query );

        if ( empty( $results ) ) {
            return [];
        }

        $this->data = $this->process_items( $results );
        wp_cache_set( $cache_key, $this->data, $this->cache_group );

        return $this->data;
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param Request $data
     *
     * @throws Exception
     * @return object|WP_Error Returns the created item, or error if not created.
     */
    public function create( Request $data ): object {
        global $wpdb;

        $data         = $data->to_array();
        $filteredData = $this->filter_data( $data );

        $wpdb->insert(
            $this->get_table(),
            $filteredData,
            $this->get_where_format( $filteredData ),
        );

        $last_id = $wpdb->insert_id;

        if ( ! $last_id ) {
            return new WP_Error( 'db_insert_error', __( 'Could not insert row into the database table.', 'pcm' ) );
        }

        // Clear cache.
        wp_cache_flush_group( $this->cache_group );

        return $this->find( $last_id );
    }

    /**
     * Update an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int     $id
     * @param Request $data
     *
     * @throws Exception
     * @return object|WP_Error Returns the updated item, or error if the item was not updated.
     */
    public function update( int $id, Request $data ): object {
        global $wpdb;

        $data         = $data->to_array();
        $filtered_data = $this->filter_data( $data );

        if ( $wpdb->update(
            $this->get_table(),
            $filtered_data,
            [
                'id' => $id,
            ],
            $this->get_where_format( $filtered_data ),
            [
                '%d',
            ],
        )
        ) {
            // Clear cache.
            wp_cache_flush_group( $this->cache_group );

            return $this->find( $id );
        }

        return new WP_Error( 'db_update_error', __( 'Could not update row into the database table.', 'pcm' ) );
    }

    /**
     * Update an item by.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $find_by
     * @param array<string, mixed> $data
     *
     * @throws \Exception
     * @return object|\WP_Error
     */
    public function update_by( array $find_by, array $data ): object {
        global $wpdb;

        $filteredData = $this->filter_data( $data );

        if ( $wpdb->update(
            $this->get_table(),
            $filteredData,
            $find_by,
            $this->get_where_format( $filteredData ),
            [
                '%d',
            ],
        )
        ) {
            // Clear cache.
            wp_cache_flush_group( $this->cache_group );

            return $this->find_by( $find_by, [] )[0];
        }

        return new WP_Error( 'db_update_error', __( 'Could not update row into the database table.', 'pcm' ) );
    }

    /**
     * Delete an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @throws Exception
     * @return int The number of rows deleted, or false on error.
     */
    public function delete( int $id ): int {
        global $wpdb;

        if ( $wpdb->delete(
            $this->get_table(),
            [
                'id' => $id,
            ],
            [
                '%d',
            ],
        ) ) {
            // Clear cache.
            wp_cache_flush_group( $this->cache_group );
            return $wpdb->rows_affected;
        }

        return 0;
    }

    /**
     * Get the table name.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     * @return string
     */
    public static function get_table(): string {
        global $wpdb;
        if ( empty( static::$table ) ) {
            throw new Exception( 'Table name is not defined' );
        }

        return $wpdb->prefix . static::$table_prefix . static::$table;
    }

    public static function get_find_key(): string {
        return static::$find_key;
    }

    /**
     * Get the table column names.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     * @return array<string>
     */
    public static function get_columns(): array {
        if ( empty( static::$columns ) ) {
            return [];
        }

        return static::$columns;
    }

    /**
     * Get the table's where format.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string> $data
     *
     * @return array<string>
     */
    private function get_where_format( $data ): array {
        $format = [];
        foreach ( $data as $key => $value ) {
            if ( isset( static::$columns[$key] ) ) {
                $format[] = static::$columns[$key];
            }
        }

        return $format;
    }

    /**
     * Filter the data to only include the available columns.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string> $data
     *
     * @throws Exception
     * @return array<string>
     */
    private function filter_data( array $data ): array {
        // Loop through columns and, check if the model has mutations.
        // Like set_created_on, set_updated_at, etc.
        foreach ( $this->get_columns() as $key => $value ) {
            if ( method_exists( $this, "set_$key" ) ) {
                $args           = $data[ "$key" ] ?? '';
                $data[ "$key" ] = call_user_func( [ $this, "set_$key" ], $args );
            }
        }

        return array_intersect_key( $data, $this->get_columns() );
    }

    /**
     * Process the data before returning it to the response.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<object> $data
     *
     * @throws \Exception
     * @return array<object>
     */
    public function process_items( array $data ): array {
        if ( empty( $data ) ) {
            return [];
        }

        foreach ( $data as &$item ) {
            $item = $this->process_item( $item );
        }

        return $data;
    }

    /**
     * Process the item before returning it to the response.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param object $item
     *
     * @throws \Exception
     * @return object
     */
    private function process_item( object $item ): object {
        $this->data = $item;
        foreach ( (array) $item as $column => $type ) {
            $method = "get_$column";
            if ( method_exists( $this, $method ) ) {
                // Check if the column has any mutation like, get_created_on, get_updated_at etc.
                $value = call_user_func( [ $this, $method ], $item->$column, static::$additional_logical_data );
                if ( is_array( $value ) ) {
                    foreach ( $value as $key => $val ) {
                        $item->$key = $val;
                    }
                    continue;
                }

                $item->$column = $value;
            }
        }

        if ( ! empty( static::$mutation_fields ) ) {
            foreach ( static::$mutation_fields as $mutation_field ) {
                $method = "get_$mutation_field";
                if ( method_exists( $this, $method ) ) {
                    // Check if the column has any mutation like, get_created_on, get_updated_at etc.
                    $value = call_user_func( [ $this, $method ], static::$additional_logical_data );
                    if ( is_array( $value ) ) {
                        foreach ( $value as $key => $val ) {
                            $item->$key = $val;
                        }
                        continue;
                    }

                    $item->$mutation_field = $value;
                }
            }
        }

        return $item;
    }

    /**
     * Magic method to get the data. This will return the data if it exists.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $name
     *
     * @return mixed|null
     */
    public function __get( string $name ) {
        if ( isset( $this->data->$name ) ) {
            return $this->data->$name;
        }

        return null;
    }

    /**
     * Magic method to set the data. This will set the data if it exists.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $name
     * @param mixed  $value
     *
     * @return void
     */
    public function __set( string $name, $value ) {
        $this->data[$name] = $value;
    }

}
