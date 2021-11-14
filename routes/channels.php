<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('chat-{user_id}', function ($user, $user_id) {
    return response()->json([
        'user' => $user,
        'user_id' => $user_id,
        'auth_user' => Auth::user()
    ]);
});

Broadcast::channel('user-online', function ($user) {
    if (auth()->check()) {
        return $user->toArray();
    }
});