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


router.post('/', ensureAuthentication, function(req, res) {
var tweet = req.body.tweet;
//tweet.id = shortId.generate();
tweet.userId = req.user.id;
tweet.created = Date.now()/1000 | 0;
var tweetObject = new Tweet(tweet);
tweetObject.save(function(err, tweet) {
	if (err)
			{
				return res.sendStatus(500);
			}
return res.status(200).send({ tweet: tweet.toClient() });
});
});



router.get('/:tweetId', function(req, res) {
  var tweetId = req.params.tweetId;
  if (tweetId)
  {
	Tweet.findById(tweetId, function(err, tweet) {
		if (err) {
      return res.sendStatus(500);
    }
		if (!tweet)
				{
					return res.status(404).send('Not Found');
				}
	return res.status(200).send({ tweet: tweet.toClient() });
	});
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});


router.get('/', function (req, res) {
  var userId = req.query.userId;
  //console.log("userId" + userId);
  if (userId)
  {
  	Tweet.find({"userId":userId}, null, { sort: {created: -1} }, function(err, tweetlist) {
  		if (tweetlist.length === 0)
	{
		return res.json({ "tweets":[] });
	}
	else
	{
		
		for(var i=0; i<tweetlist.length; i++)
		{
			tweetlist[i] = tweetlist[i].toClient();
		}
	
		return res.json({"tweets":tweetlist});
	}
  	});
  	//tweetlist = _.findByValues(fixtures.tweets, 'userId', [userId]);
	//tweetlist = _.map(_.sortByOrder(tweetlist, ['created'], [false]));
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});





router.delete('/:tweetId', ensureAuthentication, function(req, res) {
   var tweetId = req.params.tweetId;
  if (tweetId)
  {
  	Tweet.findOne({'_id':tweetId}, function(err, tweet) {
  	if (tweet && tweet.userId != req.user.id)
  	{
  		return res.status(403).send('Forbidden');
  	}
  	Tweet.findByIdAndRemove({'_id':tweetId}, function(err, tweet) {
  	if (!tweet)
	{
		return res.status(404).send('Not Found');
	}
	else
	{
		return res.status(200).send('OK');
	}
  	});
  });
  }
 else
 {
 	return res.status(400).send('Bad Request');
 }
});

module.exports = router