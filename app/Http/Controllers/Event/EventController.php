<?php

namespace App\Http\Controllers\Event;

use App\Events\ScoresUpdated;
use App\Http\Controllers\Controller;
use App\Models\Criterion;
use App\Models\Event;
use App\Models\Score;
use App\Models\SpecialAward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $validated = $request->validate([
            'scores' => 'required|array',
            'scores.*.id' => 'required|integer|exists:scores,id',
            'scores.*.score' => 'nullable|integer|min:0',
        ]);

        foreach ($validated['scores'] as $score) {
            $score = (array) $score;

            if (!array_key_exists('score', $score)) {
                continue;
            }

            $scoreToUpdate = Score::find($score['id']);

            if ($scoreToUpdate) {
                $scoreToUpdate->update([
                    'score' => $score['score'],
                ]);
            }
        }

        ScoresUpdated::dispatch();
    }


    public function create_award(Request $request)
    {        
        SpecialAward::create([
            'title' => $request->input('award_title'),
            'description' => $request->input('award_description'),
            'event_id' => $request->input('event_id'),
            'contestant_id' => $request->input('contestant_id'),
        ]);

        ScoresUpdated::dispatch();
    }

    public function remove_award(Request $request)
    {        
        $award = SpecialAward::find($request->input('special_award_id'));

        $award->update([
            'status' => 'in-active'
        ]);

        return to_route('admin', $award->event_id);

        ScoresUpdated::dispatch();
    }
}
