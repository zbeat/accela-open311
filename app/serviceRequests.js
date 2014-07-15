var cradle = require('cradle');
var accela = require('accela-construct');

var db = new(cradle.Connection)({cache: false}).database('open311');
db.view('type/config', function(error, response) {
	
	// Set up Accela Construct API client.
	var config = {};
	config.config = response[0].value;
	accela.setup(config);

	exports.list = function(req, res, next) {
		var limit = req.query.limit || '25';
		var offset = req.query.offset || '0';
		var options = { module: config.config.module };
		accela.search.records({ expand: 'addresses,contacts', limit: limit, offset: offset}, options, function (response, error) {
		    if(error) {
		    	res.errorDetails = {message: 'An error ocurred: ' + error, code: 500};
  				next(error);
		    }
		    else {
		    	res.template = 'GetSeviceRequests';
		    	res.format = req.params.ext;
		    	res.payload = response;
		    	next();		    	
		    }
		});	
	}

	exports.describe = function(req, res, next) {
			accela.records.getRecords({id: req.params.service_request_id, expand: 'addresses,parcels,professionals,contacts,owners,customForms,customTables'}, function (response, error) {
			if(error) {
		    	res.errorDetails = {message: 'An error ocurred: ' + error, code: 500};
  				next(error);
			}
			else {
				res.template = 'GetSpecificSeviceRequest';
		    	res.format = req.params.ext;
		    	res.payload = response;
		    	next();
			}
		});
	}

});