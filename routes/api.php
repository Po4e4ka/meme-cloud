<?php

use Illuminate\Support\Facades\Route;
use MemeCloud\Http\Controllers\Bucket\MediaController;

Route::post('/upload', [MediaController::class, 'upload'])->name('upload');
