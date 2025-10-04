<?php

namespace MemeCloud\Http\Controllers\Bucket;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use MemeCloud\Http\Controllers\Controller;
use MemeCloud\Services\Media\MediaService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class MediaController extends Controller
{
    public function __construct(
        private MediaService $mediaService,
    ) {}

    public function upload(Request $request): JsonResponse
    {
        if (!$file = $request->file('file')) {
            throw new NotFoundHttpException('file not found');
        }

        $media = $this->mediaService->upload($file);

        return response()->json($media);
    }
}
