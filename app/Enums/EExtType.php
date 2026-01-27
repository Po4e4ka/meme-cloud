<?php

namespace MemeCloud\Enums;

use RuntimeException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

enum EExtType: int
{
    case PNG = 1;
    case JPEG = 2;
    case WEBP = 3;
    case MP4 = 4;
    case AVI = 5;

    private const array MAPPING = [
        self::PNG->value => '.png',
        self::JPEG->value => '.jpeg',
        self::WEBP->value => '.webp',
        self::MP4->value => '.mp4',
        self::AVI->value => '.avi',
    ];

    public static function fromMime(string $clientMimeType): self
    {
        return match ($clientMimeType) {
            'image/png' => EExtType::PNG,
            'image/jpeg' => EExtType::JPEG,
            'video/mp4' => EExtType::MP4,
            'image/webp' => EExtType::WEBP,
            default => throw new BadRequestHttpException('unknown type'),
        };
    }

    public static function fromExtension(string $extension): self
    {
        $normalized = '.' . ltrim(strtolower($extension), '.');

        foreach (self::cases() as $case) {
            if ($case->stringValue() === $normalized) {
                return $case;
            }
        }

        throw new BadRequestHttpException('unknown type');
    }

    public function stringValue(): string
    {
        return self::MAPPING[$this->value] ?? throw new RuntimeException('unknown type');
    }
}
