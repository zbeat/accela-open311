var cradle = require('cradle');
var accela = require('accela-construct');

// Include credentials for calling Accela Construct API.
var config = require('../config');

// Set up Accela Construct API client.
accela.setup(config);

exports.list = function(req, res, next) {
	var limit = req.query.limit || '25';
	var offset = req.query.offset || '0';
	var options = { module: config.module };
	accela.search.records({ expand: 'addresses,parcels,professionals,contacts,owners,customForms,customTables', limit: limit, offset: offset}, options, function (response, error) {
	    if(!error) {
	    	res.template = 'GetSeviceRequests';
	    	res.format = req.params.ext;
	    	res.payload = response;
	    	next();
	    }
	    else {
	        res.status(500).end('An error ocurred: ' + error);
	    }
	});	
}

exports.describe = function(req, res, next) {
		accela.records.getRecords({id: req.params.service_request_id}, function (response, error) {
		if(!error) {
	    	res.template = 'GetSpecificSeviceRequest';
	    	res.format = req.params.ext;
	    	res.payload = response;
	    	next();
	    }
	    else {
	        res.status(500).end('An error ocurred: ' + error);
	    }
	});
}