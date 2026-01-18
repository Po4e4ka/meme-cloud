<?php

namespace MemeCloud\Http\Controllers\Web;

use Inertia\Inertia;
use MemeCloud\Http\Controllers\Controller;
use MemeCloud\Http\Resources\MediaResource;

readonly class DashboardController extends Controller
{
    public function index()
    {
        $resources = MediaResource::collection($this->currentUser()->media);

        return Inertia::render('dashboard', [
            'memes' => $resources->resolve()
        ]);
    }
    
    public function newMeme()
    {
        return Inertia::render('memes/new');
    }
}
