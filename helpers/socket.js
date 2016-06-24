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

	chatSocket.sockets.on('connection', function(socket) {
		console.log('user connected');

    var deltaTime = new Date();
	
		/* Trigger when server receives event named 'message_to_server' */
    socket.on('message_to_server', function(data) {
      /* Check if 2 seconds have passed since last event to prevent spamming */
      if (new Date() > deltaTime) {
        console.log(data);
        /* Grab token from clients request object. Use jsonwebtoken    *
         * to decrypt its content and save this clients username value */
        var token = socket.request._query.token;
        var username;
        jwt.verify(token, secret, function(err, decoded) {
          username = decoded.username;
          /* Escape received string message and send it to    *
           * all connected sockets. Also store it in database */
          var escaped_message = validator.escape(data["message"]);
          chatSocket.sockets.emit("message_to_client" , 
                                { author: username, message: escaped_message });
          message_m.storeMessage( username, escaped_message, function (err, id){});
          /* Set time difference (2 seconds from now) for sending new message */
          deltaTime = new Date(new Date().getTime() + 1*2000);
        });
      }
    });

    /* Trigger when client socket disconnects */
    socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
	});
};

