<?php

namespace MemeCloud\Http\Controllers;

use Illuminate\Http\Request;
use MemeCloud\Enums\EExtType;
use MemeCloud\Models\Media;
use MemeCloud\Services\Bucket\MinioBucketService;

readonly class StaticController extends Controller
{
    public function media(Request $request, string $hash, string $ext, MinioBucketService $bucketService)
    {
        $extEnum = EExtType::fromExtension($ext);
        $media = Media::where('hash', $hash)->where('ext', $extEnum)->first();
        if (!$media) {
            abort(404);
        }

        if ($media->user_id !== $this->currentUser()->id) {
            abort(404);
        }

        $etag = $media->hash;
        $headers = [
            'Content-Type' => $bucketService->mimeType($media),
            'Cache-Control' => 'private, max-age=31536000, immutable',
            'ETag' => $etag,
        ];

        if ($request->headers->get('If-None-Match') === $etag) {
            return response('', 304, $headers);
        }

        $stream = $bucketService->readStream($media);
        if ($stream === false) {
            abort(404);
        }

        return response()->stream(function () use ($stream) {
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, $headers);
    }
}
