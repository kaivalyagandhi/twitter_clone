var express = require('express');
var _ = require('lodash');
var app = express();
//var fixtures = require('./fixtures');
var config = require('./config');

require('./middleware')(app);
require('./router')(app);
// it imports a function exported by router/index.js
// and then calls it passing the app argument.
//
// app is your express app object.
//
// the function called here will be responsible to set your
// app to use the three routers described above.


var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;
