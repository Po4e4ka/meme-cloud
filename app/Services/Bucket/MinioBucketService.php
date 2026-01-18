<?php

namespace MemeCloud\Services\Bucket;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Storage;
use MemeCloud\Models\Media;
use MemeCloud\Models\User;

readonly class MinioBucketService
{
    public function __construct(
        /** @var User $user */
        protected ?Authenticatable $user
    ) {}

    /**
     * Получить Storage диск, настроенный для юзера.
     */
    protected function getDisk()
    {
        $bucket = $this->user->bucket;

        return Storage::build([
            'driver' => 's3',
            'bucket' => $bucket->name,
            'key' => $bucket->access_key,
            'secret' => $bucket->secret_key,
            'region' => 'us-east-1',
            'endpoint' => $bucket->endpoint,
            'use_path_style_endpoint' => true,
        ]);
    }

    /**
     * Сохранить файл (видео/картинку).
     */
    public function putMedia(Media $media): string
    {
        $path = $this->getDisk()->putFileAs(
            $media->getBucketFolder(),
            $media->file,
            $media->getBucketName(),
        );
        $media->save();

        return $path;
    }

    /**
     * Получить публичный URL (если bucket публичный).
     */
    public function url(Media $media): string
    {
        return $this->getDisk()->url($media->getFullBucketPath());
    }

    public function readStream(Media $media)
    {
        return $this->getDisk()->readStream($media->getFullBucketPath());
    }

    public function mimeType(Media $media): string
    {
        return $this->getDisk()->mimeType($media->getFullBucketPath()) ?? 'application/octet-stream';
    }
}
