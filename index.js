// Include required modules.
var express = require('express');
var accela = require('accela-construct');
var js2xmlparser = require('js2xmlparser');
var cradle = require('cradle');

// Include credentials for calling Accela Construct API.
var config = require('./config');

// Port for Express app to listen on.
var port = process.argv[2] || 3000;

// Set up Accela Construct API client.
accela.setup(config);

// Set up Express app and router.
var app = express();
var router = express.Router();
app.use('/', router);
app.listen(port);

// Ensure Jurisdiction ID is used on all requests.
router.use(function(req, res, next) {
  if(!req.query.jurisdiction_id) {
  	res.end('You must use a jurisdiction ID.');
  }
  else {
  	res.jurisdiction_id = req.query.jurisdiction_id;
  	next();
  }
});

// Get a list of service request types.
router.get('/services.:ext', function(req, res, next) {
	accela.records.getAllRecordTypes({module: config.config.module}, function (response, error) {
	    if(!error) {
	    	res.format = req.params.ext;
	    	res.payload = response;
	    	next();
	    }
	    else {
	        res.end('An error ocurred: ' + error);
	    }
	});
});

// Get a specific service definition type based on the request code.
router.get('/services/:service_code.:ext', function(req, res, next) {
	res.send('Service code: ' + req.params.service_code);
});

// Get the service_request_id from a temporary token.
router.get('/tokens/:token_id.:ext', function(req, res) {
	res.send('Token ID: ' + req.params.token_id);
});

// Get a list of service requests.
router.get('/requests.:ext', function(req, res, next) {
	var limit = req.query.limit || '25';
	var offset = req.query.offset || '0';
	accela.records.getAllRecords({ module: config.config.module, limit: limit, offset: offset}, function (response, error) {
	    if(!error) {
	    	res.format = req.params.ext;
	    	res.payload = response;
	    	next();
	    }
	    else {
	        res.end('An error ocurred: ' + error);
	    }
	});
});

// Get a specific service request based on the ID.
router.get('/requests/:service_request_id.:ext', function(req, res, next) {
	accela.records.getRecords({id: req.params.service_request_id}, function (response, error) {
		if(!error) {
	    	res.format = req.params.ext;
	    	res.payload = response;
	    	next();
	    }
	    else {
	        res.end('An error ocurred: ' + error);
	    }
	});
});

// Get all comments for a service request.
router.get('/requests/:service_request_id/comments.:ext', function(req, res, next) {
	res.format = req.params.ext;
	res.payload = { message: 'Get comments for a service requests.' };
	next();
});

// Create a new service request.
router.post('/requests.:ext', function(req, res, next) {
	if(!req.query.key) {
		res.end('API key required.')
	}
	else {
		var db = new(cradle.Connection)().database('keys');
		db.get(req.query.key, function(error, doc) {
			if(error) {
				res.end('Invalid API key.');
			}
			else {
				res.format = req.params.ext;
				res.payload = { message: 'Create service requests.' };
				next();
			}
		});
	}
});

// Add a comment to an existing service request. 
router.post('/requests/:service_request_id/comments.:ext', function(req, res, next) {
	if(!req.query.key) {
		res.end('API key required.')
	}
	else {
		var dbk = new(cradle.Connection)().database('keys');
		dbk.get(req.query.key, function(error, doc) {
			if(error) {
				res.end('Invalid API key.');
			}
			else {
				var dbc = new(cradle.Connection)().database('comments');
				dbc.save({ service_request_id: req.params.service_request_id, comment: req.query.comment }, function(error, response) {
					if(error) {
						res.end('Could not save comment.')
					}
					else {
						res.format = req.params.ext;
	    				res.payload = response;
	    				next();
					}
				});
			}
		});
	}
});

// Get an API key.
router.post('/apikey/new', function(req, res, next) {
	var db = new(cradle.Connection)().database('keys');
	db.save({ email: req.query.email, jurisdiction_id: req.query.jurisdiction_id }, function(error, response) {
		if(error) {
			res.end('Could not create API key.');
		}
		else {
			res.format = 'json';
	    	res.payload = { key: response.id };
	    	next();
		}
	});
});

// Structure and format the API response.
router.use(function(req, res, next) {
	if(res.format == 'xml') {
		res.end(js2xmlparser('result', res.payload));
	}
	else {
		res.end(JSON.stringify(res.payload));
	}
});