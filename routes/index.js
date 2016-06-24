/* This router loads all other routers */

var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/chat', require('./chat'));
router.use('/user', require('./user'));

module.exports = router;
