/* Front end javascript module for connecting to and handling our custom chat *
 * socket running on port 1337. We first ask server for token with AJAX call. *
 * we only get this token if we already have general application session      *
 * cookie set up (by being authenticated on login). User then sends this      *
 * token back for successful client/server handshake process using token.     *
 * This connects client to chat socket.                                       *
 * TODO: set up a front end framework for modularization and                  *
 * include js files in coherent and organized manner                          */

var token;
var socket;

/* Set socket connection parameters */
/* URL for chat socket authentication AJAX call */
var URL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
/* Chat socket address */
var chatSocketPath = location.hostname + ":" + 1337;

function connect(token) {
  socket = io.connect(chatSocketPath, {
    query: 'token=' + token,
    forceNew: true
  });

  socket.on('connect', function (data) {
   // alert('you are now connected to the websocket server');
  });

  socket.on("message_to_client", function(data) {
    $("#messages").append( "<div><span>" + data['author'] + "</span>" + 
                          "<span>" + data['message'] + "</span></div>" );
  });
  
  socket.on('error', function (err) {
   alert(JSON.stringify(err));
  });
};

function sendMessage(e) {
  /* If return key was pressed send message to server and empty field value */
  if(e && e.keyCode == 13) {
    var msg = document.getElementById("message_input").value;
    socket.emit("message_to_server", { message : msg});
    document.getElementById("message_input").value = "";
  }
};

$.ajax({
  type: 'POST',
  url: URL + '/chat/auth',
  /* Send session cookie data to chat socket authentication API */
  data: document.cookie
}).done(function (data) {
  token = data.token;
  // TODO unify authentication and document it!
  connect(token);
});
