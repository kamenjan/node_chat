var messageModel = {};

/**
 * [TODO update, we use knex now] 
 # This model relies on postgreSQL module [pg] for handling database 
 * connections, our database configuration [db] for connection parameters 
 * and crypto module [crypto] for hashing passwords
 */
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

messageModel.getMessages = function(callback) {
  knex.select('author', 'message').from('messages')
  .asCallback(function(err, rows) {
    callback(err, rows);
  });
}; 

messageModel.storeMessage = function(author, message, callback) {
  knex.table('messages').insert(
    {author: author, message: message}
  ).asCallback(function(err, id) {
    callback(err, id);
  });
}; 

// message.deleteAll = function(callback) {
//   console.log('storeMessage se starta');
//   knex.table('messages').insert(
//     {author: 'author', message: message}
//   ).asCallback(function(err, id) {
//     callback();
//   });
//   // knex.table('accounts').insert({account_name: 'knex', user_id: rows[0]});
// }; 

module.exports = messageModel;

