<?php

namespace MemeCloud\Http\Controllers\Memes;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use MemeCloud\Http\Controllers\Controller;
use MemeCloud\Models\Media;
use MemeCloud\Models\Tag;
use MemeCloud\Services\Media\MediaService;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class MemesController extends Controller
{
    public const string API_PATH = 'memes/';

    public function __construct(
        private MediaService $mediaService,
    ) {}

    public function upload(Request $request): void
    {
        if (!$file = $request->file('file')) {
            throw new NotFoundHttpException('file not found');
        }

        $name = $request->getPayload()->get('name');
        $previewFile = $request->file('preview');
        $tags = $request->input('tags', []);

        $media = $this->mediaService->upload($file);

        $media->name = $name;
        $media->save();

        $this->syncTags($media, $tags);

        if ($previewFile) {
            $preview = $this->mediaService->upload($previewFile);
            $preview->name = $name . ' preview';
            $preview->save();
            $media->preview_media_id = $preview->id;
            $media->save();
        }

        redirect()->route('dashboard');
    }

    public function update(Request $request, ?int $id = null): void
    {
        if (!$id) {
            throw new BadRequestHttpException('id is required');
        }

        $media = Media::where('id', $id)
            ->where('user_id', $this->currentUser()->id)
            ->first();

        if (!$media) {
            throw new NotFoundHttpException('Media not found');
        }

        $name = $request->getPayload()->get('name', $media->name);
        $previewFile = $request->file('preview');
        $tags = $request->input('tags', []);

        $media->name = $name;
        $media->save();

        $this->syncTags($media, $tags);

        if ($previewFile) {
            if ($media->preview_media_id) {
                $this->mediaService->delete($media->preview_media_id);
            }

            $preview = $this->mediaService->upload($previewFile);
            $preview->name = $name . ' preview';
            $preview->save();
            $media->preview_media_id = $preview->id;
            $media->save();
        }

        redirect()->route('dashboard');
    }

    public function delete(?int $id = null): JsonResponse
    {
        if (!$id) {
            throw new BadRequestHttpException('id is required');
        }

        $this->mediaService->delete($id);

        return response()->json(status: 204);
    }

    private function syncTags(Media $media, mixed $tags): void
    {
        if (!is_array($tags)) {
            return;
        }

        $normalized = array_values(array_filter(array_map(function ($tag) {
            if (!is_string($tag)) {
                return null;
            }

            $value = trim($tag);
            return $value !== '' ? $value : null;
        }, $tags)));

        $tagIds = [];
        foreach ($normalized as $tagName) {
            $tag = Tag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }

        $media->tags()->sync($tagIds);
    }
}
