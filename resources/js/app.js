
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

 require('./bootstrap');

 /**
  * Next, we will create a fresh React component instance and attach it to
  * the page. Then, you may begin adding components to this application
  * or customize the JavaScript scaffolding to fit your unique needs.
  */
 
  import Echo from 'laravel-echo'
    
  window.Pusher = require('pusher-js');
  
  window.Echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.MIX_PUSHER_APP_KEY,
      cluster: process.env.MIX_PUSHER_APP_CLUSTER,
      encrypted: true
  });
 
 import Chatpanel from './components/chatpanel';
 
 import React from 'react';
 import ReactDOM from 'react-dom';
 
 //if (document.getElementById('chat_panel_container')) {
 ReactDOM.render(<Chatpanel />, document.getElementById('chat_panel_container'));
 //}