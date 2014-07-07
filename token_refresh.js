var request = require('request');
var querystring = require('querystring');
var cradle = require('cradle');

var ENDPOINT = 'https://apis.accela.com/oauth2/token';

var db = new(cradle.Connection)({cache: false}).database('open311');

db.get('config', function(error, doc) {
	if(!error) {
		var body = {
				client_id: doc.app_id,
				client_secret: doc.app_secret,
				grant_type: 'refresh_token',
				refresh_token: doc.auth_values.refresh_token
			}
		var headers = {
	        'Content-Type': 'application/x-www-form-urlencoded', 
			'x-accela-appid': doc.app_id
	    };	
		var options = {
		        url: ENDPOINT,
		        method: 'POST',
		        body: querystring.stringify(body),
		        headers: headers
		    }
		request(options, function (error, response, body) {
			if(!error && response.statusCode == 200) {
				doc.auth_values = body;
				db.save('config', doc._rev, doc, function(error, response) {
					if(!error) {
						console.log('Could not save configuration values.');
					}
					else {
						console.log('Config updated.');
					}
				});
			}
			else {
				console.log('Could not fetch refersh token. Error: ' + error + '. Status Code: ' + response.statusCode);
			}
		});
	}
});