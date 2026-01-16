<?php

namespace MemeCloud\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $name
 */
class Tag extends Model
{
    protected $fillable = [
        'name',
    ];
}
