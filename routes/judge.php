<?php

use App\Models\Event;
use App\Models\EventUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/judge', function () {
        $user = Auth::user();

        $events = EventUser::where('user_id', $user->id)
            ->where('status', 'active')
            ->with([
                'event.contestants',
                'event.scores' => function ($query) use ($user) {
                    $query->whereIn('event_user_id', function($sub) use ($user) {
                        $sub->select('id')
                            ->from('event_user')
                            ->where('user_id', $user->id)
                            ->where('status', 'active');
                    });
                },
                'event.criteria'
            ])
            ->get();

        return Inertia::render('judge', [
            'eventUsers' => $events,
        ]);
    })->name('judge');

});

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
