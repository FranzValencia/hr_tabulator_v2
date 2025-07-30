<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Criterion;
use App\Models\Event;
use App\Models\EventUser;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    public function event_create (Request $request) {
       $validated = $request->validate([
            'event_name' => 'required|string',
            'criteria' => 'required|array',
            'criteria.*.name' => 'required|string',
            'criteria.*.weight' => 'required|numeric|min:1',
        ]);

        $event = Event::create([
            'name' => $validated['event_name'],
        ]);

        foreach($validated['criteria'] as $criterion){
            Criterion::create([
                'event_id' => $event->id,
                'name' => $criterion['name'],
                'weight' => $criterion['weight'],
            ]);
        }
    }

    public function add_judge (Request $request) {
       $validated = $request->validate([
            'event_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        $event = EventUser::create([
            'event_id' => $validated['event_id'],
            'user_id' => $validated['user_id'],
        ]);
    }

    public function create_judge(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullname' => 'required|string',
                'username' => 'required|string|unique:users',
                'password' => 'required|string',
            ]);

            User::create([
                'name' => $validated['fullname'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'plain_password' => $validated['password'], // Consider encrypting this if needed
                'role' => 'judge', // Add role if needed
            ]);

            return back()->with('success', 'Judge created successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->validator)->withInput();
        } catch (Exception $e) {
            return back()->with('error', 'An unexpected error occurred. Please try again.');
        }
    }
}
