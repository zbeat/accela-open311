var accela = require('accela-construct');
var cradle = require('cradle');

var db = new(cradle.Connection)({cache: false}).database('open311');
db.get('config', function(error, doc) {
	var config = {};
	config.config = { access_token: doc.auth_values.access_token, app_id: doc.app_id, app_secret: doc.app_secret, environment: doc.environment, agency: doc.agency, module: doc.module };
	accela.setup(config);
	if(!error) {
		accela.civicid.refreshToken(doc.auth_values.refresh_token, function(response, err) {
			if(!err) {
				db.merge('config', { auth_values: response }, function(er, res) {
					if(er !== null) {
						console.log('Could not save configuration values: ' + res);
					}
					else {
						console.log('Config updated.');
					}
				});
			}
			else {
				console.log('Could not refresh CivicID token. ' + err);
			}
		});
	}
	else {
		console.log('Could not fetch refersh token. Error: ' + error + '. Status Code: ' + response.statusCode);
	}
});