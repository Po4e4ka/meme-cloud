<?php

namespace MemeCloud\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\UploadedFile;
use MemeCloud\Enums\EExtType;
use MemeCloud\Enums\EMediaType;

/**
 * @property User $user
 * @property string $name
 * @property string $hash
 * @property EExtType $ext
 * @property EMediaType $type
 * @property int $user_id
 * @property int $preview_media_id
 */
class Media extends Model
{
    use SoftDeletes;
    
    public ?UploadedFile $file = null;
    protected $fillable = [
        'name',
        'hash',
        'ext',
        'type',
        'user_id',
        'preview_media_id',
    ];

    protected $casts = [
        'ext' => EExtType::class,
        'type' => EMediaType::class,
    ];

    public function getBucketFolder(): string
    {
        return "user_{$this->user->id}/";
    }

    public function getFullBucketPath(): string
    {
        return $this->getBucketFolder() . $this->getBucketName();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getBucketName(): string
    {
        return $this->hash . $this->ext->stringValue();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function isPreview(): bool
    {
        return !(bool)$this->preview_media_id;
    }

    public function preview(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'preview_media_id');
    }
}
