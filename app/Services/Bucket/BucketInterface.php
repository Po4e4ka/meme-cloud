<?php

namespace MemeCloud\Service\Bucket;

interface BucketInterface
{
    public function getBucketFolderByUserId(int $userId);
    public function getBucketByUserId(int $userId);
    public function removeBucketFolderByUserId(int $userId);
}
