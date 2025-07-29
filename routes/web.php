<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Event\EventController;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/sign-in', function () {
        return Inertia::render('login');
    })->name('login');

    Route::post('/sign-in', [AuthController::class,"login"])->name('login.post');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome',[
            'events' => Event::where('status','active')->get(),
        ]);
    })->name('home');

    Route::post('/event/create', [EventController::class, 'event_create'])->name('event.create');
});

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
