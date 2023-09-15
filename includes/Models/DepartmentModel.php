<?php

namespace PayCheckMate\Models;

class DepartmentModel extends Model {

    /**
     * The table associated with the model.
     *
     * @since  1.0.0
     *
     * @var string
     *
     * @access protected
     */
    protected static string $table = 'departments';

    /**
     * @var array|string[] $search_by
     */
    protected static array $search_by = [ 'name' ];

    /**
     * @var array|string[] $columns
     */
    protected static array $columns = [
        'name'       => '%s',
        'status'     => '%d',
        'created_on' => '%s',
        'updated_at' => '%s',
    ];

    /**
     * Make crated on mutation
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function set_created_on(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Make updated at mutation
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function set_updated_at(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Get created at mutated date.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     *
     * @return string
     */
    public function get_created_on( string $date ): string {
        return get_date_from_gmt( $date, 'd M Y' );
    }

}
