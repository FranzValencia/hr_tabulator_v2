<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criterion extends Model
{
   protected $fillable = [
        'name',
        'event_id',
        'weight',
        'status',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
