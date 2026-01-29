<?php

namespace MemeCloud\Http\Controllers\Web;

use Illuminate\Http\Request;
use Inertia\Inertia;
use MemeCloud\Http\Controllers\Controller;
use MemeCloud\Http\Resources\MediaResource;
use MemeCloud\Models\Media;
use MemeCloud\Models\Tag;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $selectedTags = $this->normalizeTags($request->input('tags', []));
        $mediaQuery = $this->currentUser()->media()->with(['tags', 'preview']);

        if ($selectedTags !== []) {
            $mediaQuery->whereHas('tags', function ($query) use ($selectedTags) {
                $query->whereIn('name', $selectedTags);
            }, '=', count($selectedTags));
        }

        $resources = MediaResource::collection($mediaQuery->get());

        return Inertia::render('dashboard', [
            'memes' => $resources->resolve(),
            'availableTags' => $this->availableTags(),
            'selectedTags' => $selectedTags,
        ]);
    }
    
    public function newMeme()
    {
        return Inertia::render('memes/new');
    }

    public function editMeme(int $id)
    {
        $media = Media::with(['tags', 'preview'])
            ->where('id', $id)
            ->where('user_id', $this->currentUser()->id)
            ->first();

        if (!$media) {
            throw new NotFoundHttpException('Media not found');
        }

        return Inertia::render('memes/edit', [
            'meme' => (new MediaResource($media))->resolve(),
        ]);
    }

    private function normalizeTags(mixed $tags): array
    {
        if (is_string($tags)) {
            $tags = explode(',', $tags);
        }

        if (!is_array($tags)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map(function ($tag) {
            if (!is_string($tag)) {
                return null;
            }

            $value = trim($tag);

            return $value === '' ? null : $value;
        }, $tags))));
    }

    private function availableTags(): array
    {
        $userId = $this->currentUser()->id;

        $previewSubQuery = Media::query()
            ->select('preview_media_id')
            ->whereNotNull('preview_media_id')
            ->where('user_id', $userId);

        return Tag::query()
            ->select('tags.name')
            ->distinct()
            ->join('media_tags', 'tags.id', '=', 'media_tags.tag_id')
            ->join('media', 'media.id', '=', 'media_tags.media_id')
            ->where('media.user_id', $userId)
            ->whereNotIn('media.id', $previewSubQuery)
            ->orderBy('tags.name')
            ->pluck('name')
            ->values()
            ->all();
    }
}
