@extends('layouts.app')

@section('content')
    <script>
        let a_tok = document.querySelector('meta[name="csrf-token"]').content;
        
        //suscribing to pusher channel
        Pusher.logToConsole = true;
        var pusher = new Pusher('451e8a2af9fe89fa25a7', {
            cluster: 'eu',
            authEndpoint:'/broadcasting/auth',
            auth:{
                headers:{
                    'X-CSRF-TOKEN':a_tok
                }
            }
        });
    
    </script>
    <div class="container">
        <div class="row">
            <div class="col-md">
                <div id="chat_panel_container"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md">
            <div id="chat_submit_container"></div>
            </div>
        </div>
    </div>

    
@endsection