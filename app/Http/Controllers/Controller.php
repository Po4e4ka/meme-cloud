<?php

namespace MemeCloud\Http\Controllers;

use Auth;
use MemeCloud\Models\User;

abstract readonly class Controller
{
    protected function currentUser(): User
    {
        return Auth::user();
    }
}
