module.exports = function(req,res,next) {
	if (!req.isAuthenticated())
  {
  	return res.status(403).send('Forbidden');
  }
  else
  {
  	next();
  }
};