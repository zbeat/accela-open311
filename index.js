// Include required modules.
var express = require('express');
var accela = require('accela-construct');
var js2xmlparser = require('js2xmlparser');

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
  	next();
  }
});

// Get a list of serice request types.
router.get('/services.:ext', function(req, res, next) {
	accela.records.getAllRecordTypes({module: 'ServiceRequest'}, function (response, error) {
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
	accela.records.getAllRecords({ module: 'ServiceRequest', limit: limit, offset: offset}, function (response, error) {
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

// Create a new service request.
router.post('/requests.:ext', function(req, res, next) {
	res.send('Create service requests.');
});

// Add a comment to an existing service request. 
router.post('/requests/:service_request_id/comments.:ext', function(req, res, next) {
	res.send('Add a new comment.');
});

router.post('/apikey/new', function(req, res, next) {
	res.send('Get a new API key.');
});

// Structure and format the response.
router.use(function(req, res, next) {
	if(res.format == 'xml') {
		res.send(js2xmlparser('', res.payload));
	}
	else {
		res.send(res.payload);
	}
});

