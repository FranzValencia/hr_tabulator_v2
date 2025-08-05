<?php

namespace App\Http\Controllers\Contestant;

use App\Http\Controllers\Controller;
use App\Models\Contestant;
use App\Models\Criterion;
use App\Models\EventUser;
use App\Models\Score;
use Illuminate\Http\Request;

class ContestantController extends Controller
{
    public function create_contestant (Request $request) {
       $validated = $request->validate([
            'name' => 'required|string',
            'event_id' => 'required|integer',
        ]);

        $contestant = Contestant::create([
            'name' => $validated['name'],
            'event_id' => $validated['event_id'],
        ]);

        $judges = EventUser::where('event_id',$validated['event_id'])->get();
        $criteria = Criterion::where('event_id',$validated['event_id'])->get();

        foreach($judges as $judge){
            foreach($criteria as $criterion){
                Score::create([
                    'event_id' => $validated['event_id'],
                    'event_user_id' => $judge->id,
                    'contestant_id' => $contestant->id,
                    'criterion_id' => $criterion->id,
                ]);
            }
        }
    }

    public function remove_contestant (Request $request) {
        $validated = $request->validate([
            'contestant_id' => 'required|integer',
        ]);

        $contestant = Contestant::find($validated['contestant_id']);
        $contestant->delete();
    }
}
