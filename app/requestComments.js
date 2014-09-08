var cradle = require('cradle');

exports.create = function(req, res, next) {
var db = new(cradle.Connection)({cache: false}).database('open311');
	db.get(res.key, function(error, doc) {
		if(error) {
			res.errorDetails = {message: 'Invalid API key.', code: 403};
  			next(error);
		}
		else {
			var doc =
				{ 
					type: 'comment', 
					service_request_id: req.params.service_request_id, 
					comment: req.query.comment,
					jurisdiction_id: req.query.jurisdiction_id,
					key: req.query.key
				}
			db.save(doc, function(error, response) {
				if(error) {
			    	res.errorDetails = {message: 'An error ocurred: ' + error, code: 500};
	  				next(error);				}
				else {
					res.template = 'PostNewComment';
					res.format = req.params.ext;
    				res.payload = { success: response.ok };
    				next();
				}
			});
		}
	});
}

exports.list = function(req, res, next) {
var db = new(cradle.Connection)().database('open311');
var path = 
	db.list('type/get-comments/comments', {request_id: req.params.service_request_id}, function(error, response) {
		if(error) {
			res.errorDetails = {message: error, code: 404};
  			next(error);
		}
		else {
			res.template = 'GetRequestComments';
			res.format = req.params.ext;
			res.payload = response;
			next();
		}
	});
}