<?php

namespace MemeCloud\Services\Bucket;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Storage;
use MemeCloud\Models\Media;
use MemeCloud\Models\User;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

readonly class BucketService
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
        $adapter = Storage::build([
            'driver' => 's3',
            'bucket' => $bucket->name,
            'key' => $bucket->access_key,
            'secret' => $bucket->secret_key,
            'region' => 'ru-3',
            'endpoint' => $bucket->endpoint,
            'use_path_style_endpoint' => true,
        ]);
        return $adapter;
    }

    /**
     * Сохранить файл (видео/картинку).
     */
    public function putMedia(Media $media): string
    {
        $path = $this->getDisk()->putFileAs(
            rtrim($media->getBucketFolder(), '/'),
            $media->file,
            $media->getBucketName(),
        );
        if (!$path) {
            throw new BadRequestException('Ошибка, файл не сохранён в бакет.');
        }
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
