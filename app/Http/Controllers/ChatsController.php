<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageEvent;
use App\Events\OnlineUser;
use Auth;
use DB;

class ChatsController extends Controller
{
    //
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

        public function fetchUsers(){
            $user_arr = array();
            $arr = User::all();
            foreach($arr as $a){
              if($a->id == Auth::user()->id){}
              else{
                array_push($user_arr,$a);
              }
            }
            return json_encode($user_arr);
          }


                        /**
                 * Fetch all messages
                 *
                 * @return Message
                 */
                public function fetchMessages(Request $req)
                {
                $sender_id = Auth::user()->id;
                $rec_id = $req->input('rec_id');
                $msg_list = DB::select('select * from messages where sender_id in ('.$sender_id.','.$rec_id.') and rec_id in ('.$sender_id.','.$rec_id.')');
                //$msg_list = Message::where('sender_id',$sender_id)->first();
                return json_encode($msg_list);
                }

            /**
             * Persist message to database
             *
             * @param  Request $request
             * @return Response
             */
            public function sendMessage(Request $request)
            {
            $user = Auth::user();

            $m = new Message();
            $m->sender_id = $user->id;
            $m->rec_id = $request->input('rec_id');
            $m->message = $request->input('message');
            $m->sent = 'sent';
            $m->save();
            
            // $message = $user->messages()->create([
            //   'rec_id' => $request->input('rec_id'),
            //   'message' => $request->input('message')
            // ]);

            broadcast(new MessageEvent($user->id,$request->input('rec_id'),$request->input('message')));

            return ['success'=>'msg sent'];
            }
            
}
