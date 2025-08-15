<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('scores-updated.{adminId}', function ($authUser, $adminId) {
    return (int) $authUser->id === (int) $adminId;
});

