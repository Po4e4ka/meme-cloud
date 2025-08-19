<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('', function () {
        return Inertia::render('dashboard', ['memes' => [[
            'id' => 1243,
            'title' => 'Жопка',
            'image_url' => 'https://i.pinimg.com/474x/46/f0/89/46f0896e9d7f564845f91b0fc1a77dc5.jpg?nii=t',
    ]]]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
