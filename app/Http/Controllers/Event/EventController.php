<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Criterion;
use App\Models\Event;
use Illuminate\Http\Request;

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
}
