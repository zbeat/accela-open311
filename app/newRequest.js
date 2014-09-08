var cradle = require('cradle');
var accela = require('accela-construct');

var db = new(cradle.Connection)({cache: false}).database('open311');
db.view('type/config', function(error, response) {

	// Set up Accela Construct API client.
	var config = {};
	config.config = response[0].value;
	accela.setup(config);

	exports.create = function(req, res, next) {
		if(req.query.lat == null || req.query.long == null) {
			res.errorDetails = {message: 'request must include coordinates of issue being reported.' + error, code: 403};
	  		next(error);
		}
		var db = new(cradle.Connection)().database('open311');
		db.get(res.key, function(error, doc) {
			if(error) {
				res.errorDetails = {message: 'Invalid API key.', code: 403};
	  			next(error);
			}
			else {

				// Assembly record address.
				var addresses = [
					{
						xCoordinate: req.query.lat,
			        	yCoordinate: req.query.long,
			        	streetStart: req.query.streetNumber || null,
			        	streetName: req.query.streetName || null,
			        	streetSuffix: {
						     text: req.query.streetSuffix || null,
						     value: req.query.streetSuffix || null
						   },
			        	city: req.query.city  || null,
				        state: {
						     text: req.query.state  || null,
						     value: req.query.state || null
						   },
				        postalCode: req.query.zip  || null,
            			isPrimary: null
					}
				]

				// Capture media URL.
				var shortNotes = req.query.media_url || null;

				// Assemble record.
				var record = {
				    module: config.config.module,
				    createdBy: 'MDEVELOPER',
				    serviceProviderCode: res.jurisdiction_id.toUpperCase(),
				    type: {
				        subType: req.query.service_name,
				        group: config.config.module,
				        text: req.query.service_name,
				        value: req.query.service_code,
				        type: req.query.service_name,	
				        module: config.config.module
				    },
				    description: req.query.description,
				    addresses: addresses,
				    shortNotes: shortNotes
				}

				// Create new record.
				accela.records.createRecord(null, record, function(response, error) {
					if (error) {
						res.errorDetails = { message: 'Could not create service request record.' + error, code: 500 };
	  					next(error);
					}
					else {
						res.payload = response;
						res.template = 'PostServiceRequest';
						res.format = req.params.ext;
						next();	
					}
				});
			}
		});
	}
});