<?php

namespace DemoPlugin\Contracts;

use DemoPlugin\Requests\Request;

interface ModelInterface {

    /**
     * Get all the items.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param array<string, mixed> $args
     *
     * @return array<object>
     */
    public function all( array $args ): array;

    /**
     * Get a single item.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param int   $id
     * @param array<string, mixed> $args
     *
     * @return object
     */
    public function find( int $id, array $args = [] ): object;

    /**
     * Get the items from the database by.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param array<string, mixed> $find_by
     * @param array<string, mixed> $args
     * @param array<string> $fields
     *
     * @return array<object>
     */
    public function find_by( array $find_by, array $args, array $fields = [ '*' ] ): array;

    /**
     * Create a new item.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param Request $data
     *
     * @return object
     */
    public function create( Request $data ): object;

    /**
     * Update an item.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param int     $id
     * @param Request $data
     *
     * @return object
     */
    public function update( int $id, Request $data ): object;

    /**
     * Delete an item.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param int $id
     *
     * @return int
     */
    public function delete( int $id ): int;

    /**
     * Count the number of items.
     *
     * @since PLUGIN_NAME_VERSION
     *
     * @param array<string> $args
     *
     * @return int
     */
    public function count( array $args = [] ): int;
}
