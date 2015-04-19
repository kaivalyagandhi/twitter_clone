var mongoose = require('mongoose');
var config = require('../config');
var TweetSchema = require('./schemas/tweet');
var UserSchema = require('./schemas/user');
var connection = mongoose.createConnection(
    config.get('database:host')
  , config.get('database:name')
  , config.get('database:port'));
connection.model('Tweet', TweetSchema);
connection.model('User', UserSchema);

module.exports = connection;