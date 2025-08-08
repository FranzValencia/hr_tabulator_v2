<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
     protected $fillable = [
        'event_id',
        'event_user_id',
        'contestant_id',
        'criterion_id',
        'score'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function eventUser()
    {
        return $this->belongsTo(EventUser::class, 'event_user_id');
    }


    public function judge()
    {
        return $this->belongsTo(User::class);
    }

    public function contestant()
    {
        return $this->belongsTo(Contestant::class);
    }

    public function criterion()
    {
        return $this->belongsTo(Criterion::class);
    }
}
