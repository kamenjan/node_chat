/* Socket helper is run right after application setup. It sets up a     *
 * new server side socket that listens on port 1337 for incoming        *
 * connections. Those are made when authenticated users visit '/chat'.  *
 * Besides listening and emitting, this helper has some other basic     *
 * functionality (authenticating connection requests, escaping received *
 * strings and enforcing anti spam mechanism using delta time)          */
module.exports = function(port) {
	
	var validator = require('validator');
	var socket = require('socket.io');
  var message_m = require('../models/message');

	var chatSocket = socket.listen(port);

  /* Socket authentication helper */
  var jwt = require("jsonwebtoken");

  /* Require secret for IO token */
  var secret = require('../config/config.js')["session_settings"]['secret'];

  /* Use socket authentication middleware */
  chatSocket.use(require('socketio-jwt').authorize({
    secret: secret,
    handshake: true
  }));

  /* Lightweight JavaScript Library for parsing dates */
  var momentjs = require('moment');

  /* Connected clients set */
  var connectedClients = new Set();

	chatSocket.sockets.on('connection', function(socket) {
		console.log('user connected');
    
    /* Add clients user name to connectedClients */
    /* and send list to all clients for update   */
    connectedClients.add(socket.decoded_token.username);
    chatSocket.sockets.emit("update_client_list" , Array.from(connectedClients));

    var deltaTime = new Date();
	
		/* Trigger when server receives event named 'message_to_server' */
    socket.on('message_to_server', function(data) {
      /* Check if 2 seconds have passed since last event to prevent spamming */
      if (new Date() > deltaTime) {
        /* Grab token from clients request object. Use jsonwebtoken    */
        /* to decrypt its content and save this clients username value */
        var token = socket.request._query.token;
        jwt.verify(token, secret, function(err, decoded) {
          /* Escape received string message, grab message author, mark */ 
          /* current time, parse it to HH:mm format and send this data */ 
          /* to all connected sockets. Also store message in database. */
          var username = decoded.username;
          var escaped_message = validator.escape(data["message"]);
          var time = momentjs(Date.now()).format("HH:mm");
          chatSocket.sockets.emit("message_to_client" , 
                                { time: time, author: username, message: escaped_message });
          message_m.storeMessage( username, escaped_message, function (err, id){});
          /* Set time difference (2 seconds from now) for sending new message */
          deltaTime = new Date(new Date().getTime() + 1*2000);
        });
      }
    });

    /* Trigger when client socket disconnects */
    socket.on('disconnect', function(){
    	console.log('user disconnected');
      /* Remove client from connectedClients and send list to all clients for update */
      connectedClients.delete(socket.decoded_token.username);
      chatSocket.sockets.emit(
        "update_client_list", 
        Array.from(connectedClients)
      );
  	});
	});
};

