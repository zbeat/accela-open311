var accela = require('accela-construct');

// Include credentials for calling Accela Construct API.
var config = require('../config');

// Set up Accela Construct API client.
accela.setup(config);

exports.list = function(req, res, next) {
	accela.records.getAllRecordTypes({module: config.config.module}, function (response, error) {
	    if(!error) {
	    	res.template = 'GetServicesList';
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
	accela.records.getAllRecordTypes({module: config.config.module}, function (response, error) {
	    if(!error) {
	    	res.template = 'GetServiceDefinition';
	    	res.format = req.params.ext;
	    	for(var i=0; i<response.result.length; i++) {
	    		if(response.result[i].id == req.params.service_code) {
		    		res.payload = response.result[i];
		    		break;
	    		}
	    	}
	    	next();
	    }
	    else {
	        res.status(500).end('An error ocurred: ' + error);
	    }
	});
}