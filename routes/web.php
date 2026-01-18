<?php

use Illuminate\Support\Facades\Route;
use MemeCloud\Http\Controllers\StaticController;
use MemeCloud\Http\Controllers\Web\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/memes/new', [DashboardController::class, 'newMeme'])->name('new-meme');
    Route::get('/memes/{id}/edit', [DashboardController::class, 'editMeme'])->name('meme.edit');
    Route::get('/-/static/media/{hash}.{ext}', [StaticController::class, 'media'])->name('static.media');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
