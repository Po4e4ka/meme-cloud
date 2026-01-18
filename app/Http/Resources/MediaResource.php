<?php

namespace MemeCloud\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use MemeCloud\Models\Media;

/**
 * @mixin Media
 */
class MediaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $preview = $this->preview;
        $mediaForPreview = $preview ?? $this;

        return [
            'id'    => $this->id,
            'title' => $this->name,
            'image_url' => route('static.media', [
                'hash' => $mediaForPreview->hash,
                'ext' => ltrim($mediaForPreview->ext->stringValue(), '.'),
            ]),
        ];
    }
}
