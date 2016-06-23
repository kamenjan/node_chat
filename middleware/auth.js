/* Authentication middleware function that checks users session cookie for  *
 * loggedin value. This value gets set in freshly baked session cookie when * 
 * user successfully logins in /routes/user.js POST(/login) route           */

module.exports = function(req, res, next) {
  if (req.chat_session.loggedin) {
  	console.log('user is logged in');
    next();
  } else {
  	console.log('unauthorized');
  	res.send('unauthorized');
    // res.status(401).end()
  }
}

