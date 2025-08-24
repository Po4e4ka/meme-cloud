<?php

namespace MemeCloud\Http\Controllers\Bucket;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use MemeCloud\Http\Controllers\Controller;
use MemeCloud\Services\Bucket\MinioBucketService;

class BucketController extends Controller
{
    public function __construct(
        private readonly MinioBucketService $minioBucketService,
    ) {}

    public function upload(Request $request): JsonResponse
    {
        $path = $this->minioBucketService->putFile($request->file('file'));

        return response()->json([
            'path' => $path,
            'url' => $this->minioBucketService->url($path),
        ]);
    }
}
