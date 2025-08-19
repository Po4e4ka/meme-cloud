<?php

namespace MemeCloud\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Bucket extends Model
{
    protected $fillable = [
        'endpoint',
        'access_key',
        'secret_key',
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
