/* TODO create separate configuration folder  * 
 * and file for different environments        */
var config = {
	env : "development",
	db : {
		type     : "postgres",
		host     : "localhost",
		port     : "3030",
		name     : "database_name",
		user     : "database_user",
		password : "databse_password"
	},
	session_settings : {
	  cookieName: 'app_cookie',
	  secret: "long_random_string",
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 60 * 1000,
	  cookie: {
	    ephemeral: false, 
	    httpOnly: true, 
	    secure: false
	  }
	}
};  

module.exports = config;

