<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/sign-in', function () {
    return Inertia::render('login');
})->name('login');

Route::post('/sign-in', [AuthController::class,"login"])->name('login.post');

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
});

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
