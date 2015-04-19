var express = require('express')
  , router = express.Router()
var bodyParser = require('body-parser');
var shortId = require('shortid');
var session  = require('express-session');
var passport = require('./auth');
var cookieParser = require('cookie-parser');
var conn = require('../../db')
  , User = conn.model('User')
  , Tweet = conn.model('Tweet');
require('../../middleware')(router);
var ensureAuthentication = require('../../middleware/ensureAuthentication');


// POST /api/users/
router.post('/', function (req, res) {
  // handle POST requests to /api/users
  var user = req.body.user;
	user.followingIds = [];
	var userProfile = new User(user);
	userProfile.save(function(err) {
    if (err)
    {
    	if (err.code === 11000) 
	    {
	    	return res.status(409).send('Conflict');
	      // Duplicate key error. One or more fields that were supposed to be unique
	      // contain values that already exist in the database.
	    }
    }
		req.login(userProfile, function(err) {
			if (err)
			{
				return res.sendStatus(500);
			}
			return res.status(200).send('OK');
		});
});
});

// GET /api/users/:userId
router.get('/:userId', function (req, res) {
  // handle GET request to /api/users/:userId
  var userId = req.params.userId;
  if (userId)
  {
  	User.findOne({"id":userId}, function(err, user){
	if (err)
	{
		return res.status(404).send('Not Found');
	}
	else
	{
		return res.json({"user":user.toClient()});
	}
});
  	
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});

router.put('/:userId', ensureAuthentication, function(req, res) {
var userId = req.params.userId;
  if (userId)
  {
  	if (userId != req.user.id)
	{
		return res.status(403).send('Forbidden');
	}
  	User.findOneAndUpdate({"id":userId}, {"password":req.body.password}, function(){
		return res.sendStatus(200);
});
  	
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});

router.post('/:userId/follow', ensureAuthentication, function (req, res) {
  // handle GET request to /api/users/:userId
  var userId = req.params.userId;
  if (userId)
  {
  	User.findOne({"id":userId}, function(err, user){
	if (!user)
	{
		return res.sendStatus(403);
	}
	else
	{

		User.findOneAndUpdate({"id":req.user.id}, { $addToSet: {followingIds: userId}}, function(err) {
			if (!err)
			{
				return res.sendStatus(200);
			}
		});
	}
});
  	
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});

router.post('/:userId/unfollow', ensureAuthentication, function (req, res) {
  req.user.unfollow(req.params.userId, function(err) {
    if (err) {
      return res.sendStatus(500)
    }
    res.sendStatus(200)
  })
});

router.get('/:userId/friends', function (req, res) {
  // handle GET request to /api/users/:userId
  var userId = req.params.userId;
  if (userId)
  {
 	User.find({followingIds:{$in:[userId]}}, null, null, function(err, userlist) {
 		//User.find({followingIds: userId}, function(err, userlist) {
 	if (!userlist)
	{
		return res.sendStatus(404);
	}
	else
	{
		console.log(userlist);
		for(var i=0; i<userlist.length; i++)
		{
			userlist[i] = userlist[i].toClient();
		}
		return res.status(200).send({"users":userlist});
	}
 	})
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});

// etc...

module.exports = router