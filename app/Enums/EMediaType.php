<?php

namespace MemeCloud\Enums;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

enum EMediaType: int
{
    case IMAGE = 1;
    case VIDEO = 2;

    public static function fromExt(EExtType $ext)
    {
        return match ($ext) {
            EExtType::JPEG,
            EExtType::WEBP,
            EExtType::PNG => self::IMAGE,
            EExtType::AVI,
            EExtType::MP4 => self::VIDEO,
            default => throw new BadRequestHttpException('unknown type'),
        };
    }
}
