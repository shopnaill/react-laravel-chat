<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('fetchmessages',  [ChatsController::class , 'fetchmessages'])->middleware('auth.apikey');
Route::post('messages',  [ChatsController::class , 'sendMessage'])->middleware('auth.apikey');
Route::post('fetchUsers/{user_id}',  [ChatsController::class , 'fetchUsers'])->middleware('auth.apikey');