<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'status',
    ];

    public function criteria()
    {
        return $this->hasMany(Criterion::class);
    }

    public function judges(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_user', 'event_id', 'user_id')->wherePivot('status', 'active');
    }


}
