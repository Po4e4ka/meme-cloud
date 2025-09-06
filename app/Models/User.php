<?php

namespace MemeCloud\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property int id
 * @property Bucket $bucket
 * @property Media[] $media
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'bucket_id',
    ];

    protected $hidden = [
        'password',
        'bucket_id',
        'remember_token',
    ];


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'bucket_id' => 'integer',
        ];
    }

    public function bucket(): BelongsTo
    {
        return $this->belongsTo(Bucket::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }
}
