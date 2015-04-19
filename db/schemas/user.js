var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  id:  { type: String, unique: true },
  name: String,
  email:   { type: String, unique: true },
  password:   String,
  followingIds: { type: [String], default: []}
});

UserSchema.pre('save', function (next) {
  // get encrypted value of this.password
var that = this;
bcrypt.hash(this.password, 8, function(err, hash) {
// assign encrypted value to this.password
that.password = hash;
// call next() when you're done
  next();
});
});

UserSchema.methods.toClient = function () {
	var user = {"id":this.id, "name":this.name};
	return user;
};

UserSchema.methods.unfollow = function(userId, done) {
  var update = { '$pull': { followingIds: userId } }
  this.model('User').findByIdAndUpdate(this._id, update, done)
}

module.exports = UserSchema;