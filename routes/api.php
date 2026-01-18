<?php

use Illuminate\Support\Facades\Route;
use MemeCloud\Http\Controllers\Memes\MemesController;

$v1 = config('api.v1');
$apiBasePath = config('api.base_path');

Route::controller(MemesController::class)->prefix("$apiBasePath$v1/" . MemesController::API_PATH)->group(function () {
    Route::post('/upload', 'upload')->name('meme.upload');
    Route::post('/{id}/update', 'update')->name('meme.update');
    Route::delete('/{id}/delete', 'delete')->name('meme.delete');
});
