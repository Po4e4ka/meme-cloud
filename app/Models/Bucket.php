<?php

namespace MemeCloud\Models;

use Illuminate\Database\Eloquent\Model;

class Bucket extends Model
{
    protected $fillable = [
        'endpoint',
        'access_key',
        'secret_key',
    ];
}
