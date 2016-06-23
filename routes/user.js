var express = require('express');
var router = express.Router();

/* Get user model for handling database operations  */
var user_m = require('../models/user');

/* We will need our custom object helper for determining if object is 'empty' */
var isObjectEmpty = require("../helpers/object_helper");

/* Socket authentication helper */
var jwt = require("jsonwebtoken");

/* Handle login GET request and render a form */
router.get('/login', function(req, res) {
  res.render('form', { accountAction: 'login' });
});

/* Handle login POST request and check POST data against database entries.   *
 * For database access we use our custom user model (user_m) that helps us   *
 * managing controller like processes using callbacks provided by user model */
router.post('/login', function(req, res) {

	/* Collect POST data from request body */
  // console.log(req.body);
  var userName = req.body.username;
  var password = req.body.password;

  /* Pass that data to user models login function, which       *
   * either returns row containing user data upon successful   *
   * login or an empty object if client did not enter correct  *
   * login information (combination of user name and password) */
  user_m.login(userName, password, function(err, row) {
    
    /* If row contains data login user, otherwise throw him back an error */
  	if (!isObjectEmpty(row)) {
      /* If user is not already logged in */
      if (!req.chat_session.loggedin) {
        req.chat_session.name = row[0].user_name;
        req.chat_session.loggedin = true;
      } 
      res.redirect('/');
  	} else {
  		res.render('form', 
        { accountAction: 'login', 
  				errorMessage: 'Invalid user name and/or password' }
      );
  	}
  });
});

/* logout GET */
router.get('/logout', function(req, res) {
  req.chat_session.reset();
  res.redirect('/'); 
});

module.exports = router;