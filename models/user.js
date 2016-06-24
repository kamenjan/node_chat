var user = {};

/**
 * [TODO update, we use knex now] 
 # This model relies on postgreSQL module [pg] for handling database 
 * connections, our database configuration [db] for connection parameters 
 * and crypto module [crypto] for hashing passwords
 */
var crypto = require('crypto');
var db = require('../config/config.js')["db"];
var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : db["host"],
    user     : db["user"],
    password : db["password"],
    database : db["name"]
  }
});

/* Very simple user registration function.     *
 * IMPORTANT! You will have to choose your     *
 * own registration method and specifications. */
user.add = function(userName, password) {
  
  var hashPassword = crypto.createHash('sha256').update(password).digest('hex');
  knex('users').insert({user_name: userName, password: hashPassword})
  .catch(function(error) {
    console.error(error)
  });;
}; 

user.login = function(userName, password, callback) {

  var hashPassword = crypto.createHash('sha256').update(password).digest('hex');

  knex.select('user_id', 'user_name', 'password')
  .from('users')
  .where('user_name', userName)
  .andWhere('password', hashPassword)
  .asCallback(function(err, rows) {
    callback(err, rows);
  });
}; 

user.find = function(userName, callback) {
  knex.select('user_name')
  .from('users')
  .where('user_name', userName)
  .asCallback(function(err, rows) {
    callback(err, rows);
  });
}; 

module.exports = user;

