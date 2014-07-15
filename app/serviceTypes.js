var cradle = require('cradle');
var accela = require('accela-construct');

var db = new(cradle.Connection)({cache: false}).database('open311');
db.view('type/config', function(error, response) {

	// Set up Accela Construct API client.
	var config = {};
	config.config = response[0].value;
	accela.setup(config);

	exports.list = function(req, res, next) {
		accela.records.getAllRecordTypes({module: config.config.module}, function (response, error) {
		    if(error) {
		    	res.errorDetails = {message: 'An error ocurred: ' + error, code: 500};
  				next(error);
		    }
		    else {
		    	res.template = 'GetServicesList';
		    	res.format = req.params.ext;
		    	res.payload = response;
		    	next();
		    }
		});
	}

	exports.describe = function(req, res, next) {
		accela.records.getAllRecordTypes({module: config.config.module}, function (response, error) {
		    if(error) {
		    	res.errorDetails = {message: 'An error ocurred: ' + error, code: 500};
  				next(error);
		    }
		    else {
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
		});
	}

});