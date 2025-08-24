<?php

namespace MemeCloud\Services\Bucket;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Storage;
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
    public function putFile($file): string
    {
        return $this->getDisk()->putFile($this->getFolderByUser(), $file);
    }

    /**
     * Получить публичный URL (если bucket публичный).
     */
    public function url(string $file_path): string
    {
        return $this->getDisk()->url($this->getFolderByUser() . $file_path);
    }

    /**
     * Получить временную ссылку (если bucket приватный).
     */
    public function temporaryUrl(string $file_path, int $minutes = 10): string
    {
        return $this->getDisk()->temporaryUrl($this->getFolderByUser() . $file_path, now()->addMinutes($minutes));
    }

    private function getFolderByUser()
    {
        return "user_{$this->user->id}/";
    }
}
