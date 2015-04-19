var bodyParser = require('body-parser');
var session  = require('express-session');
var passport = require('../auth');
var cookieParser = require('cookie-parser');
module.exports = function(app) {
  // add here all the application level middleware
  // that your app needs to use.
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
}
