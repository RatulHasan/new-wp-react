<?php

namespace PayCheckMate\Requests;

class DepartmentRequest extends Request {

    protected static string $nonce = 'pay_check_mate_nonce';

    protected static array $fillable = [ 'name' ];

    // Have to create a rule that will validate $request in next.
    protected static array $rules = [
        'name'       => 'sanitize_text_field',
        'status'     => 'absint',
        'created_on' => 'sanitize_text_field',
        'updated_at' => 'sanitize_text_field',
    ];
}
