<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Judge\JudgeController;
use App\Http\Controllers\Participant\ParticipantController;
use App\Models\Event;
use App\Models\EventUser;
use App\Models\User;
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

    Route::get('/admin/event/{id}', function ($id) {
        $userIds = EventUser::where('event_id', $id)->where('status','active')->pluck('user_id')->toArray();
        $judges = User::where('status', 'active')
            ->whereNotIn('id', $userIds)
            ->whereNot('username', 'admin')
            ->get();

        $event = Event::with('criteria')->with('judges')->with('participants')->findOrFail($id);

        return Inertia::render('admin', [
            'judges_to_choose_from' => $judges,
            'event' => $event,
        ]);
    })->name('admin');

    Route::post('/event/create', [EventController::class, 'event_create'])->name('event.create');

    // JUDGE CONTROLLER ROUTES
    Route::post('/add-judge', [JudgeController::class, 'add_judge'])->name('event.add.judge');
    Route::delete('/remove-judge', [JudgeController::class, 'remove_judge'])->name('event.remove.judge');
    Route::post('/create-judge', [JudgeController::class, 'create_judge'])->name('event.create.judge');

    // PARTICIPANT CONTROLLER ROUTES
    Route::post('/create-participant', [ParticipantController::class, 'create_participant'])->name('create.participant');
    Route::delete('/remove-participant', [ParticipantController::class, 'remove_participant'])->name('remove.participant');
});

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
