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

/* [OLD] This function does not yet use knex and should be removed/updated  */
user.add = function(userName, password) {
  pg.connect(connection, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    client.query(
      "INSERT INTO users (user_name, password) VALUES ($1, $2)", 
      [userName, hashPassword], function(err, result) {
      //call `done()` to release the client back to the pool 
      done();
   
      if(err) {
        return console.error('error running query', err);
      }
      console.log(result);
    });
  });
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

