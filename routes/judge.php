<?php

use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/judge', function () {
        $user = Auth::user();

        // Get all events where the current user is an active judge
        $events = Event::whereHas('judges', function ($query) use ($user) {
            $query->where('users.id', $user->id)
                ->where('event_user.status', 'active');
        })
        ->with(['criteria', 'contestants', 'scores'])
        ->get();

        return Inertia::render('judge', [
            'events' => $events,
        ]);
    })->name('judge');
});

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
