<?php

namespace MemeCloud\Http\Controllers\Web;

use Inertia\Inertia;
use MemeCloud\Http\Controllers\Controller;
use MemeCloud\Http\Resources\MediaResource;
use MemeCloud\Models\Media;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class DashboardController extends Controller
{
    public function index()
    {
        $resources = MediaResource::collection($this->currentUser()->media);

        return Inertia::render('dashboard', [
            'memes' => $resources->resolve()
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
}
