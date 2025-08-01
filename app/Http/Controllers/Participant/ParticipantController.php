<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function create_participant (Request $request) {
       $validated = $request->validate([
            'name' => 'required|string',
            'event_id' => 'required|integer',
        ]);

        Participant::create([
            'name' => $validated['name'],
            'event_id' => $validated['event_id'],
        ]);
    }
}
