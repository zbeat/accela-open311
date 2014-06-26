var cradle = require('cradle');
var accela = require('accela-construct');

// Include credentials for calling Accela Construct API.
var config = require('../config');

// Set up Accela Construct API client.
accela.setup(config);

exports.create = function(req, res, next) {
	var db = new(cradle.Connection)().database('open311');
	db.get(res.key, function(error, doc) {
		if(error) {
			res.status(403).end('Invalid API key.');
		}
		else {

		record = {
			    module: "ServiceRequest",
			    createdBy: 'Open311 Server',
			    serviceProviderCode: res.jurisdiction_id,
			    type: {
			        subType: "Graffiti",
			        group: "ServiceRequest",
			        text: "Graffiti",
			        value: "ServiceRequest/Graffiti/Graffiti/NA",
			        type: "Graffiti",
			        module: "ServiceRequest"
			    },
			    description: 'This is a test service request for Open311.'
			}

			address = [
				{
					xCoordinate: req.query.lat,
		        	yCoordinate: req.query.lon
				}
			]
			comment = { text: 'http://this.isnotre.al' }

			accela.records.createRecord(null, record, function(response, error, body) {
				if (!error && response.statusCode == 200) {
				response = JSON.parse(body);
				var record_id = response.result.id;
					accela.records.createRecordAddresses({recordID: record_id}, addresses, function(response, error, body) {
						if (!error && response.statusCode == 200) {
							accela.records.createRecordComments({recordID: record_id}, comment, function(response, error, body) {
								if (!error && response.statusCode == 200) {
									res.template = 'PostServiceRequest';
									res.format = req.params.ext;
									res.payload = { service_request_id: record_id };
									next();
								}
								else {
									// Add logging.
									res.status(500).end('Could not create service request. Step 3.');
								}
							});
						}
						else {
							// Add logging.
							res.status(500).end('Could not create service request. Step 2.');
						}
					});
				}
				else {
					// Add logging.
					res.status(500).end('Could not create service request. ' + error);
				}
			});
		}
	});
}