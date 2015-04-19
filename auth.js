var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');
var fixtures = require('./fixtures');
var conn = require('./db')
  , User = conn.model('User');
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
 User.findOne({"id":id}, function(err, user){
  if (!user)
  {
    done(null, false);
  }
  else
  {
    done(null, user);
  }
 });
});

function verifyCredentials(username, password, done) {
   User.findOne({"id":username}, function(err, user){
    if (err) {
      return done(err);
    }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function(err, res) {
    // res == true
      if (!res) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
       });
    });
}

passport.use(new LocalStrategy(verifyCredentials));

module.exports = passport;