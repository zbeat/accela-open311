var cradle = require('cradle');
var accela = require('accela-construct');

// Include credentials for calling Accela Construct API.
var config = require('../config');

// Set up Accela Construct API client.
accela.setup(config);

exports.create = function(req, res, next) {
	if(req.query.lat == null || req.query.long == null) {
		res.status(400).end('request must include coordinates of issue being reported.');
	}
	var db = new(cradle.Connection)().database('open311');
	db.get(res.key, function(error, doc) {
		if(error) {
			res.status(403).end('Invalid API key.');
		}
		else {
		record = {
			    module: config.config.module,
			    createdBy: 'MDEVELOPER',
			    serviceProviderCode: res.jurisdiction_id.toUpperCase(),
			    type: {
			        subType: req.query.subType,
			        group: req.query.group,
			        text: req.query.text,
			        value: req.query.value,
			        type: req.query.type,	
			        module: config.config.module
			    },
			    description: req.query.description
			}

			addresses = [
				{
					xCoordinate: req.query.lat,
		        	yCoordinate: req.query.long,
		        	streetStart: req.query.streetNumber,
		        	streetName: req.query.streetName,
		        	city: req.query.city,
			        state: {
					     text: req.query.state,
					     value: req.query.state
					   },
			        postalCode: req.query.zip
				}
			]
			comment = [ { text: req.query.media_url } ]

			accela.records.createRecord(null, record, function(response, error) {
				if (!error) {
				res.payload = response;
				var record_id = response.result.id;
					accela.records.createRecordAddresses({recordID: record_id}, addresses, function(response, error) {
						if (!error) {
							accela.records.createRecordComments({recordID: record_id}, comment, function(response, error) {
								if (!error) {
									res.template = 'PostServiceRequest';
									res.format = req.params.ext;
									next();
								}
								else {
									// Add logging.
									res.status(500).end('Could not create service request comment');
								}
							});
						}
						else {
							// Add logging.
							res.status(500).end('Could not create service request address.');
						}
					});
				}
				else {
					// Add logging.
					console.log(response.statusCode);
					res.status(500).end('Could not create service request record.');
				}
			});
		}
	});
}