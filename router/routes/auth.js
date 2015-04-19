var express = require('express')
  , router = express.Router()
var bodyParser = require('body-parser');
var shortId = require('shortid');
var session  = require('express-session');
var passport = require('../../auth');
var cookieParser = require('cookie-parser');
var conn = require('../../db')
  , User = conn.model('User')
  , Tweet = conn.model('Tweet');
require('../../middleware')(router);
var ensureAuthentication = require('../../middleware/ensureAuthentication');


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(500).send('Internal Error'); }
    if (!user) { return res.status(403).send('Forbidden'); }
    var _user = user;
    req.logIn(user, function(err) {
      if (err) { return res.status(403).send('Forbidden'); }
      return res.status(200).send({"user":_user.toClient()});
    });
  })(req, res, next);
});

router.post('/logout', function(req, res) {
	req.logout();
	return res.status(200).send('OK');
});


module.exports = router