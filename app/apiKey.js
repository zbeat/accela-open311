var cradle = require('cradle');

exports.create = function(req, res, next) {
	if(!req.query.email) {
		res.status(500).end('You must supply an email address');
	}
	else {
		var db = new(cradle.Connection)().database('open311');
		db.save({ type: 'key', email: req.query.email, jurisdiction_id: req.query.jurisdiction_id }, function(error, response) {
			if(error) {
				res.status(500).end('Could not create API key.');
			}
			else {
				res.template = 'NewAPIKey';
				res.format = req.params.ext;
		    	res.payload = { key: response.id };
		    	next();
			}
		});
	}
}