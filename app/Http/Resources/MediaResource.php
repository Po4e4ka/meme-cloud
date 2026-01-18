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
        $mediaUrl = route('static.media', [
            'hash' => $this->hash,
            'ext' => ltrim($this->ext->stringValue(), '.'),
        ]);
        $previewUrl = $preview
            ? route('static.media', [
                'hash' => $preview->hash,
                'ext' => ltrim($preview->ext->stringValue(), '.'),
            ])
            : null;

        return [
            'id'    => $this->id,
            'title' => $this->name,
            'image_url' => route('static.media', [
                'hash' => $mediaForPreview->hash,
                'ext' => ltrim($mediaForPreview->ext->stringValue(), '.'),
            ]),
            'media_url' => $mediaUrl,
            'preview_url' => $previewUrl,
            'type' => strtolower($this->type->name),
            'tags' => $this->tags->pluck('name')->values(),
        ];
    }
}
