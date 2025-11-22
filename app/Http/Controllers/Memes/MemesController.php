<?php

namespace MemeCloud\Http\Controllers\Memes;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use MemeCloud\Http\Controllers\Controller;
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

        $media = $this->mediaService->upload($file);

        $media->name = $name;
        $media->save();

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
}
