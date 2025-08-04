<?php

namespace App\Http\Controllers\Contestant;

use App\Http\Controllers\Controller;
use App\Models\Contestant;
use Illuminate\Http\Request;

class ContestantController extends Controller
{
    public function create_contestant (Request $request) {
       $validated = $request->validate([
            'name' => 'required|string',
            'event_id' => 'required|integer',
        ]);

        Contestant::create([
            'name' => $validated['name'],
            'event_id' => $validated['event_id'],
        ]);
    }

    public function remove_contestant (Request $request) {
        $validated = $request->validate([
            'contestant_id' => 'required|integer',
        ]);

        $contestant = Contestant::find($validated['contestant_id']);
        $contestant->delete();
    }
}
