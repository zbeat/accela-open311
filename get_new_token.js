var accela = require('accela-construct');
var cradle = require('cradle');

var username = process.argv[2];
var password = process.argv[3];
var app_id = process.argv[4];
var app_secret = process.argv[5];

var db = new(cradle.Connection)({cache: false}).database('open311');
db.get('config', function(error, doc) {
	var config = {};
	config.config = { access_token: doc.auth_values.access_token, app_id: app_id, app_secret: app_secret, environment: doc.environment, agency: doc.agency, module: doc.module };
	accela.setup(config);
	if(!error) {
		accela.civicid.getToken(username, password, 'create_record create_record_addresses get_civicid_profile get_record get_settings_record_types search_addresses search_contacts', function(response, err) {
			if(!err) {
				db.merge('config', { auth_values: response, app_id: app_id, app_secret: app_secret}, function(er, res) {
					if(er !== null) {
						console.log('Could not save configuration values: ' + res);
					}
					else {
						console.log('Config updated.');
					}
				});
			}
			else {
				console.log('Could not get new CivicID token. ' + err);
			}
		});
	}
	else {
		console.log('Could not fetch refersh token. Error: ' + error + '. Status Code: ' + response.statusCode);
	}

});