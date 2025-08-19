<?php

use Illuminate\Support\Facades\Route;
use MemeCloud\Http\Controllers\Bucket\BucketController;

Route::post('/upload', [BucketController::class, 'upload'])->name('upload');
