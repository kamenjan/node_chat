var express = require('express');
var router = express.Router();

/* Get user and message model for handling database operations  */  
var message_m = require('../models/message');
var user_m = require('../models/user');

/* Middleware function for simple authentication via users session cookie */
var authMiddleware = require('../middleware/auth');

/* We will need our custom object helper for determining if object is 'empty' */
var isObjectEmpty = require("../helpers/object_helper");

/* Lightweight JavaScript Library for parsing dates */
var momentjs = require('moment');

/* Socket authentication helper */
var jwt = require("jsonwebtoken");

/* Require secret for IO token */
var chatSessionTokenSecret = require('../config/config.js')["session_settings"]['secret'];

/* Main chat GET route. It first uses our custom authentication  */
/* function. If authentication succeeds it grabs all stored chat */
/* messages from message model and sends them to rendered view   */
router.get('/', authMiddleware, function (req, res) {
  message_m.getMessages( function(err, rows) {
    var data = [];
    /* TODO: use promise, because we might not get all data before sending it */
    rows.forEach( function(element) {
      var time = momentjs(element['time']).format("HH:mm");
      data.push([time, element['author'], element['message']]);
    });
    res.locals.messages = data;
    res.render('chat');
  });
});

/* Chat POST route for authenticating socket session. This handler is called *
 * by automatic onload AJAX call from chat main view, which loads only if    *
 * user has been authenticated in chats main GET route. If someone was to    *
 * invoke this route by hand and without our encrypted cookie session, he    *
 * would only get JSON object with {success: false} key-value pair           */
router.post('/auth', function(req, res) {
  /* Get cookie 'chat_session' from request, read its 'user' value,      *
   * decrypt it ('client-session' does that for us, we just have to get  * 
   * value from session cookie) and check against DB for match/validate. */
  var username = req.chat_session.name;

  if (username != undefined) {
    user_m.find(username, function(err, row) {
      /* If row contains data, user was found */
      if (!isObjectEmpty(row)) {
        var user = { username: username };
        var token = jwt.sign(user, chatSessionTokenSecret, { expiresIn: 3600});
        res.json({token: token});
      } else {
        res.json({success: false});
      }
    });  
  } else {
    res.json({success: false});
  }
});

module.exports = router;