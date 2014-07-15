var cradle = require('cradle');

exports.log = function(log, callback) {
	var db = new(cradle.Connection)({cache: false}).database('errorlog');
	db.save(log, function(error, response) {
		if(error) {
			console.log('An error occured. ' + error);
		}
		callback();
	});
}
