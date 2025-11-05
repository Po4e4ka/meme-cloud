<?php

use Illuminate\Support\Facades\Route;
use MemeCloud\Http\Controllers\Bucket\MediaController;

$v1 = config('api.v1');
$apiBasePath = config('api.base_path');

Route::controller(MediaController::class)->prefix("$apiBasePath$v1/" . MediaController::API_PATH)->group(function () {
    Route::post('/upload', 'upload')->name('media.upload');
    Route::delete('/{id}/delete', 'delete')->name('media.delete');
});
