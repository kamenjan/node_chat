var express = require('express');
var path = require('path');

/* Initialize our application */
var app = express();

/* Define local variables to be used by views and templates */
app.locals.title = 'Express chat and message board';

/* Set environment, which is defined inside config.js */
var env = require('./config/config.js')["env"];
app.set('env', env);
 
/* Setup and open socket on port 1337 for async chat functionality */
var socket = require("./helpers/socket")(1337);

/* Require logger for development needs */
if (app.get('env') === 'development') { 
  var logger = require('morgan');
  app.use(logger('dev'));
}

/* Set up npm middleware for parsing post request bodies */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Set up npm less processor middleware */
app.use(require('less-middleware')(path.join(__dirname, 'public')));

/* Define front end public content container folder */
app.use(express.static('public'));

/* Define application session cookie and settings */
var session = require('client-sessions');
var session_settings = require('./config/config.js')["session_settings"];
app.use(session(session_settings));

/* Require and use all our routes/controllers */
app.use(require('./routes'));

/* View engine and views path setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Development error handler [show stacktrace = TRUE] */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/* Production error handler [show stacktrace = FALSE] */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
