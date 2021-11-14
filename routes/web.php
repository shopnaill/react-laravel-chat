<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ChatsController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

 
Auth::routes();

  
Route::get('/',  [HomeController::class , 'index']);
Route::post('fetchmessages',  [ChatsController::class , 'fetchmessages']);
Route::post('messages',  [ChatsController::class , 'sendMessage']);
Route::post('fetchUsers',  [ChatsController::class , 'fetchUsers']);
