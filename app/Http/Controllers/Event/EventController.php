<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Criterion;
use App\Models\Event;
use App\Models\Score;
use App\Models\SpecialAward;
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



    public function update_scores(Request $request)
    {        
        $scores = $request->input('scores', []);

        foreach ($scores as $score) {
            $score = (array) $score; // convert object to array

            if (!isset($score['id'], $score['score'])) {
                continue; // skip invalid data
            }

            $scoreToUpdate = Score::find($score['id']);

            if ($scoreToUpdate) {
                $scoreToUpdate->update([
                    'score' => $score['score'],
                ]);
            }
        }

    }


    public function create_award(Request $request)
    {        
        SpecialAward::create([
            'title' => $request->input('award_title'),
            'description' => $request->input('award_description'),
            'event_id' => $request->input('event_id'),
            'contestant_id' => $request->input('contestant_id'),
        ]);
    }

    public function remove_award(Request $request)
    {        
        $award = SpecialAward::find($request->input('special_award_id'));

        $award->update([
            'status' => 'in-active'
        ]);

        return to_route('admin', $award->event_id);
    }
}
