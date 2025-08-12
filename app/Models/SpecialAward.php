<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpecialAward extends Model
{
    // Define which attributes can be mass assigned
    protected $fillable = [
        'title',
        'description',
        'event_id',
        'contestant_id',
        'status',
    ];

    /**
     * Get the contestant that owns the special award.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function contestant(): BelongsTo
    {
        return $this->belongsTo(Contestant::class);
    }
}