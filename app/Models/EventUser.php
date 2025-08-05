<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventUser extends Model
{
    protected $table = 'event_user';
     /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'event_id',
        'user_id',
        'status',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'event_user_id');
    }

    public function criteria()
    {
        return $this->hasManyThrough(
            Criterion::class,
            Event::class,
            'id',        // Event's primary key
            'event_id',  // Criterion foreign key
            'event_id',  // EventUser foreign key
            'id'         // Event primary key
        );
    }

}
