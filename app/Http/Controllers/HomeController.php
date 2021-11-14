<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\OnlineUser;
use Auth;
use DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
       broadcast(new OnlineUser($user))->toOthers();

      return view('home');
    }
}
