<?php

use Illuminate\Support\Facades\Route;
use MemeCloud\Http\Controllers\StaticController;
use MemeCloud\Http\Controllers\Web\DashboardController;

Route::get('/build/sw.js', function () {
    $path = public_path('build/sw.js');

    if (! file_exists($path)) {
        abort(404);
    }

    return response()->file($path, [
        'Service-Worker-Allowed' => '/',
        'Cache-Control' => 'no-cache',
    ]);
})->name('pwa.sw');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/memes/new', [DashboardController::class, 'newMeme'])->name('new-meme');
    Route::get('/memes/{id}/edit', [DashboardController::class, 'editMeme'])->name('meme.edit');
    Route::get('/-/static/media/{hash}.{ext}', [StaticController::class, 'media'])->name('static.media');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
