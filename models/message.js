var messageModel = {};

/* This model relies on knex javascript library [knex] for building */
/* SQL queries. It interacts with our postgreSQL database and       */
/* accepts configuration parameters [db] from our config.js file.   */
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
  knex.select('time', 'author', 'message').from('messages')
  .asCallback(function(err, rows) {
    callback(err, rows);
  });
}; 

/* Insert message from client to database. For time column */ 
/* (timestamp with timezone), we use postgresql's function */
/* now(), which returns time at the point of insertion     */
messageModel.storeMessage = function(author, message, callback) {
  knex.table('messages').insert(
    {time: 'now', author: author, message: message}
  ).asCallback(function(err, id) {
    callback(err, id);
  });
}; 

module.exports = messageModel;

