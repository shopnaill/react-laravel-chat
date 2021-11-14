import React from 'react';
import './styles.css';

class Chatpanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            msg_list:[],
            user_list:[],
            online_list:[],
            active_user:[]
        }        
        //alert(user.id);
        this.handleEve = this.handleEve.bind(this);
        this.subscribeToPusher = this.subscribeToPusher.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.onlineUsers = this.onlineUsers.bind(this);
        this.loadChats = this.loadChats.bind(this);
        this.getActiveUser = this.getActiveUser.bind(this);
        
    }

    componentDidMount(){
        this.loadUsers();
        this.subscribeToPusher(); 
        this.onlineUsers(); 


    }

    getActiveUser(){
        if(this.state.active_user.length == 0){
            return;
        }
        else{
            return this.state.active_user[0];
        }
    }

    loadUsers(){
        let tok = document.querySelector('meta[name="csrf-token"]').content;


        console.log('token : '+tok);

        fetch('/fetchUsers',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                X_CSRF_TOKEN:tok,
                'Accept':'application/json'
            }
        })
        .then(response => response.json())
        .then(dat => {
            let arr = [];
            for(var x=0;x<dat.length;x++){
                arr.push(dat[x]);
            }
            this.setState({user_list:this.state.user_list.concat(arr)});
        })
        .catch((error) => {
            console.error(error);
        }); 
    }

    onlineUsers(){
        Echo.join('user-online')
        .here(users => (this.setState({online_list:users})))
        .joining( user => {

            let arr = [];
            arr.push(user);
            console.log('joining : '+JSON.stringify(arr));
            this.setState({
                online_list:this.state.online_list.concat(arr)
            });

             //console.log('online list : '+JSON.stringify(this.online_list))
        })
        .leaving( user => {
            let arr = [];
            arr.push(user);
            console.log('leaving : '+JSON.stringify(arr));
            this.setState({
                online_list:this.state.online_list.filter(function(el){
                    return el.id != user.id;
                })
            });
        });
     }

    loadChats(el_id){
        let clicked_user_id = el_id.target.id;
        clicked_user_id = clicked_user_id.substr(5,clicked_user_id.length);
        
        
        for(var eu=0;eu<this.state.user_list.length;eu++){
            if(this.state.user_list[eu].id == clicked_user_id){
                this.setState({active_user:this.state.active_user.splice(0,this.state.active_user.length)});
                this.setState({active_user:this.state.active_user.concat(this.state.user_list[eu])});
                break;
            }
        }
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        // alert(el_id.target.id);
        fetch('/fetchmessages?rec_id='+clicked_user_id,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                X_CSRF_TOKEN:tok,
                'Accept':'application/json'
            }
        })
        .then(response => response.json())
        .then(dat => {
            this.setState({
                //activeUser:this.state.activeUser.push(this.state.user_list[clicked_user_id
            });
            console.log(JSON.stringify(dat));
            let arr = [];
            for(var x=0;x<dat.length;x++){
                //console.log(JSON.stringify(dat[x].message));
                arr.push(dat[x]);      
            }
            this.setState({msg_list:[]});
            this.setState({
                msg_list:this.state.msg_list.concat(arr)
            });
        })
        .catch((error) => {
            console.error(error);
        }); 
    }
    

    handleEve(e){
        let msg = document.getElementById('chat_tbox').value;
        
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        
        let activeUserId = this.state.active_user[0].id;
    

        fetch('/messages?message='+msg+'&rec_id='+activeUserId,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':tok,
                'Accept':'application/json'
            },
            //body:JSON.stringify(data)
        })
        .then(response => response.json())
        .then(dat => {
            console.log('from handleve : '+JSON.stringify(dat));
            document.getElementById('chat_tbox').value = null;
        })
        .catch((error) => {
            console.error(error);
        });
       // console.log('Message sent  : '+msg);

         this.setState({msg_list:this.state.msg_list.concat({sender_id: user.id , rec_id: activeUserId, message: msg})});
 

        
    }

    subscribeToPusher(){

        var new_msg = [];
        var channel = pusher.subscribe('private-chat-'+user.id);
     

        var online_users = pusher.subscribe('user-online');



        online_users.bind('App\\Events\\OnlineUser',(d) => {


        });   


        channel.bind('App\\Events\\MessageEvent',(d) => {
            
            //checking sent message from sender side
            if(d.sender_id == user.id){
                if(this.state.active_user[0].id == d.rec_id){
                   ///  document.getElementById('message_status').innerText= 'sent';
                     const div =  document.querySelector('.pendding') // Get element from DOM
                     div.innerHTML = "<i class='fas fa-check float-right' ></i>" // Remove class "info"
                     div.classList.remove('pendding') // Remove class "info"
                     div.classList.add('sent') // Remove class "info"
                    //    this.setState({msg_list:this.state.msg_list.concat(d)});
                 //   console.log(d);
                }
            }
            
            //checking message has been received or not
            if(d.sender_id != user.id){
                if(this.state.active_user.length != 0){
                    if(this.state.active_user[0].id == d.sender_id){
                        //alert('you have sent message to this user.');
                        this.setState({msg_list:this.state.msg_list.concat(d)});
                     //   console.log(d);

                    }
                    else{
                        var id_to_notify = document.getElementById('user_'+d.sender_id);
                    }
                }
                else{
                    alert('no active user, you got a new message : '+d.message);
                }
            }

        });        
    }

    

    render(){
        let isAnyUserActive=false;
        if(this.state.active_user.length != 0){
            isAnyUserActive=true;
        }
        let all = [];
        let usersOn = this.state.online_list;
        let onIds = [];

        this.state.user_list.forEach(function (olduser) {
            
            usersOn.forEach(function (onlineuser) {
                if (onlineuser.id != user.id) {
                   if (onIds.length !=0) {
                    for (var i = 0; i < onIds.length; i++) {
                        if (onIds[i].id != onlineuser.id) {
                            onIds.push({ id: onlineuser.id, name: onlineuser.name ,state : 'on'});
                        }
                    }
                   }else
                   {
                    onIds.push({ id: onlineuser.id, name: onlineuser.name ,state : 'on'});
                   }
                }
            });
            if (onIds.length != 0) {
                for (var i = 0; i < onIds.length; i++) {
                //    console.log('user_id' + onIds[i].id);
                    if (onIds[i].id != olduser.id && olduser.id != user.id) {
                        all.push({ id: olduser.id, name: olduser.name, state: 'off'});
                    }
                }
            }else
            {
                if (olduser.id != user.id) {
                    all.push({ id: olduser.id, name: olduser.name, state: 'off'});
                }
             }
              
          });
        //  console.log(JSON.stringify(all));
       //   console.log(JSON.stringify(onIds));

        return (
            <div className="container">     
                          
                <div className="row no-gutters">
                    <div className="col-3">
                        <div className="card">
                            <div className="card-header">card header</div>
                            <div className="card-body">
                                <ul id="user_list" className="user_list list-group">
                                {all.map((msgs) => 
                                        (msgs.id!=user.id)?    
                                        <a href="#">
                                        <li id={"user_"+msgs.id} onClick={this.loadChats} className="list-group-item d-flex justify-content-between align-items-center" key={'user_'+msgs.id}>
                                            {msgs.name}
                                            <i className="fas fa-circle text-dark"></i>
                                            <span className="badge badge-primary badge-pill">14</span>
                                        </li>
                                         </a> 
                                         :
                                        null
                                    
                                    )}

                                    {onIds.map((msgs) => 
                                        (msgs.id!=user.id)?    
                                        <a href="#">
                                        <li id={"user_"+msgs.id} onClick={this.loadChats} className="list-group-item d-flex justify-content-between align-items-center" key={'user_'+msgs.id}>
                                            {msgs.name}
                                            <i className="fas fa-circle text-success"></i>
                                            <span className="badge badge-primary badge-pill">14</span>
                                        </li>
                                         </a> 
                                         :
                                        null
                                    
                                    )}
 

                                </ul>
                            </div>                            
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">{isAnyUserActive?this.state.active_user[0].name:'no active'}</div>
                            <div className="card-body">
                                <ul id="chat_list" className="chat_list">
                                    {this.state.msg_list.map((msgs) => 
                                        (msgs.sender_id==user.id)?    
                                        <div className="sent" id={msgs.id} key={msgs.id}>{msgs.message} <span className={msgs.sent ? 'sent' : 'pendding'} id={msgs.sent + '_' + msgs.id}>{msgs.sent ? <i className="fas fa-check float-right"></i> : <i className="fas fa-clock float-right"></i>}</span></div>                                
                                        :
                                        <div className="replies" id={msgs.id} key={msgs.id}>{msgs.message}</div>
                                    
                                    )}
                                </ul>
                            </div>
                            <div className="card-footer">
                                <input type="text" id="chat_tbox" className="form-control" placeholder="Enter message..." />
                                <input type="submit" className="btn btn-primary btn-sm" value="Send" onClick={this.handleEve} />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        );
    }
}
export default Chatpanel;