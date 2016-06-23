var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  /* Get user name from cookie and send it to template */
  if (req.chat_session.loggedin) {
    res.locals.name = req.chat_session.name;
  } else {
    res.locals.name = 'stranger';
  }
  res.render('index');
});

module.exports = router;