var express = require('express');
var accela = require('accela-construct');
var config = require('./config');
var js2xmlparser = require('js2xmlparser');

accela.setup(config);

var app = express();

function generateRespone(type, response) {
	if(type == 'xml') {
		return js2xmlparser('', response);
	}
	else {
		return response;
	}	
}

app.get('/services.:ext', function(req, res) {
	accela.records.getAllRecordTypes({module: 'ServiceRequest'}, function (response, error) {
	    if(!error) {
	    	res.send(generateRespone(req.params.ext, response));     
	    }
	    else {
	        res.send('An error ocurred: ' + error);
	    }
	});
});

app.get('/services/:service_code', function(req, res) {
	res.send('Service code: ' + req.params.service_code);
});

app.get('/tokens/:token_id', function(req, res) {
	res.send('Token ID: ' + req.params.token_id);
});

app.get('/requests', function(req, res) {
	var limit = req.query.limit || '25';
	var offset = req.query.offset || '0';
	accela.records.getAllRecords({ module: 'ServiceRequest', limit: limit, offset: offset}, function (response, error) {
	    if(!error) {
	        res.send(response);
	    }
	    else {
	        res.send('An error ocurred: ' + error);
	    }
	});
});

app.get('/requests/:service_request_id', function(req, res) {
	accela.records.getRecords({id: req.params.service_request_id}, function (response, error) {
		if(!error) {
			res.send(response);
		}
		else {
			res.send('An error ocurred: ' + error);
		}
	});
});

app.post('/requests', function(req, res) {
	res.send('Create service requests');
});

app.listen(3000);