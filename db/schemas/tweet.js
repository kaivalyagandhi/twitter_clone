var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  userId: String,
  created: Number,
  text:   String
});

TweetSchema.methods.toClient = function (tweet) {
	return {"id":this._id, "text":this.text, "created":this.created, "userId":this.userId};
};

module.exports = TweetSchema;