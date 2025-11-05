<?php

namespace MemeCloud\Services\Media;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\UploadedFile;
use MemeCloud\Enums\EExtType;
use MemeCloud\Enums\EMediaType;
use MemeCloud\Models\Media;
use MemeCloud\Models\User;
use MemeCloud\Services\Bucket\MinioBucketService;
use RuntimeException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class MediaService
{
    /**
     * @param User $user
     */
    public function __construct(
        private Authenticatable $user,
        private MinioBucketService $minioBucketService,
    )
    {
        if (!$user instanceof User) {
            throw new RuntimeException('User object must implement User');
        }
    }

    public function upload(UploadedFile $file): Media
    {
        $media = $this->makeFromFile($file);
        $media->save();

        $this->minioBucketService->putMedia($media);

        return $media;
    }

    private function makeFromFile(UploadedFile $file): Media
    {
        $hash = md5_file($file->getRealPath());
        $media = Media::where('hash', $hash)->first();

        if ($media) {
            throw new BadRequestException('Media already exists');
        }

        $media = new Media();
        $media->user()->associate($this->user);
        $media->file = $file;
        $media->name = 'testname.png';
        $media->ext  = EExtType::fromMime($file->getClientMimeType());
        $media->type = EMediaType::fromExt($media->ext);
        $media->hash = $hash;

        return $media;
    }

    public function delete(mixed $id): bool
    {
        $media = Media::find($id);
        if (!$media) {
            throw new NotFoundHttpException('Media not found');
        }
        
        $media->delete();
        
        return true;
    }
}
