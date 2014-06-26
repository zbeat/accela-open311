// Include required modules.
var express = require('express');
var js2xmlparser = require('js2xmlparser');
var json2json = require('./json2json');

// Include app components.
var serviceTypes = require('./app/serviceTypes');
var serviceRequests = require('./app/serviceRequests');
var newRequest = require('./app/newRequest');
var requestComments = require('./app/requestComments');
var apiKey = require('./app/apiKey');

// Port for Express app to listen on.
var port = process.argv[2] || 3000;

// Set up Express app and router.
var app = express();
var router = express.Router();
app.listen(port);

// Ensure Jurisdiction ID is used on all requests & API key on POST requests.
app.use(function(req, res, next) {
  if(!req.query.jurisdiction_id) {
  	res.status(403).end('You must use a jurisdiction ID.');
  }
  else {
  	res.jurisdiction_id = req.query.jurisdiction_id;
	if(req.method == 'POST') {
		if(!req.query.key) {
			res.status(403).end('You must use an API key.');
		}
		else {
			res.key = req.query.key;
			next();
		}
	}
	else {
		next();
	}
  }
});

// Get a list of service request types.
app.get('/services.:ext', function(req, res, next) {
	serviceTypes.list(req, res, next);
});

// Get a specific service definition type based on the request code.
app.get('/services/:service_code.:ext', function(req, res, next) {
	serviceTypes.describe(req, res, next);
});

// Get the service_request_id from a temporary token.
app.get('/tokens/:token_id.:ext', function(req, res) {
	res.status(404).end('Method not implemented.');
});

// Get a list of service requests.
app.get('/requests.:ext', function(req, res, next) {
	serviceRequests.list(req, res, next);
});

// Get a specific service request based on the ID.
app.get('/requests/:service_request_id.:ext', function(req, res, next) {
	serviceRequests.describe(req, res, next);
});

// Create a new service request.
app.post('/requests.:ext', function(req, res, next){
	newRequest.create(req, res, next);
});

// Get all comments for a service request.
app.get('/requests/comments/:service_request_id.:ext', function(req, res, next) {
	requestComments.list(req, res, next);
});

// Add a comment to an existing service request. 
app.post('/requests/comments/:service_request_id.:ext', function(req, res, next) {
	requestComments.create(req, res, next);
});

// Get an API key.
app.put('/apikey/new.:ext', function(req, res, next) {
	apiKey.create(req, res, next);
});

// Structure and format the API response.
app.use(function(req, res, next) {
	json2json.parse(res.template, res.payload, res.jurisdiction_id, function(error, result, options) {
		if(!error) {
			if(res.format == 'xml') {
				res.header('Content-type', 'text/xml');
				res.end(js2xmlparser(options.rootName, result, options));
			}
			else {
				res.json(result);
			}
		}
		else {
			res.status(500).end(error);
		}
	});
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).end('An error occured');
});