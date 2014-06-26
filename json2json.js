exports.parse = function(template, payload, jurisdiction_id, callback) {
	switch(template) {
		case 'GetServicesList':
			getServicesList(payload, jurisdiction_id, callback);
			break;
		case 'GetServiceDefinition':
			getServiceDefinition(payload, jurisdiction_id, callback);
			break;
		case 'GetSeviceRequests':
			getSeviceRequests(payload, jurisdiction_id, callback);
			break;
		case 'GetSpecificSeviceRequest':
			getSpecificSeviceRequest(payload, jurisdiction_id, callback);
			break;
		case 'GetRequestComments':
			getRequestComments(payload, jurisdiction_id, callback);
			break;
		case 'PostServiceRequest':
			postServiceRequests(payload, jurisdiction_id, callback);
			break;
		case 'PostNewComment':
			postNewComment(payload, jurisdiction_id, callback);
			break;
		case 'NewAPIKey':
			newAPIKey(payload, jurisdiction_id, callback);
			break;
	}
}

function getServicesList(payload, jurisdiction_id, callback) {

	var services = [];
	var xmlOptions = { rootName: 'services', wrapArray: { enabled: true }, wrapArrayItem: 'service' };
	for(var i=0; i<payload.result.length; i++) {
		var service = {
		    'service_code': payload.result[i].id,
		    'metadata': false,
		    'type': 'realtime',
		    'keywords': payload.result[i].subtype,
		    'group': payload.result[i].subtype,
		    'service_name': payload.result[i].type,
		    'description': payload.result[i].text
		  }
		services.push(service);  
	}
	callback(null, services, xmlOptions);
};

function getServiceDefinition(payload, jurisdiction_id, callback) {

};

function getSeviceRequests(payload, jurisdiction_id, callback) {

	var requests = [];
	var xmlOptions = { rootName: 'requests', wrapArray: { enabled: true }, wrapArrayItem: 'request' };
	for(var i=0; i<payload.result.length; i++) {

		var address = '', address_id = '', zipcode = '', lat = '', lon = '', state = '', status = '';
		if(payload.result[i].addresses) {
			address = payload.result[i].addresses[0].streetStart + ' ';
			address += payload.result[i].addresses[0].streetName + ' ';
			if(payload.result[i].addresses[0].streetSuffix) {
				address += payload.result[i].addresses[0].streetSuffix.text + ', ';
			}
			address += payload.result[i].addresses[0].city + ', ';
			if(payload.result[i].addresses[0].state) {
				state = payload.result[i].addresses[0].state.text + ' ';
			}
			address += state
			address += payload.result[i].addresses[0].postalCode;
			address_id = payload.result[i].addresses[0].id;
			zipcode = payload.result[i].addresses[0].postalCode;
			lat = payload.result[i].addresses[0].xCoordinate;
			lon = payload.result[i].addresses[0].yCoordinate;
		}
		if(payload.result[i].status) {
			status = payload.result[i].status.text;
		}

		var request = {
		    'service_request_id': payload.result[i].id,
		    'status': status,
		    'service_name': payload.result[i].type.text,
		    'service_code': payload.result[i].type.id,
		    'description': payload.result[i].description,
		    'agency_responsible': payload.result[i].assignedToDepartment,
		    'requested_datetime': payload.result[i].reportedDate,
		    'updated_datetime': payload.result[i].statusDate,
		    'address': address,
		    'address_id': address_id,
		    'zipcode': zipcode,
		    'lat': lat,
		    'long': lon,
		    'media_url':'http://thisisface.com'
		}
		requests.push(request);
	}
	callback(null, requests, xmlOptions);
};

function getSpecificSeviceRequest(payload, jurisdiction_id, callback) {

};

function getRequestComments(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'comments', wrapArray: { enabled: true }, wrapArrayItem: 'comment' };
	callback(null, payload, xmlOptions);
};

function postServiceRequests(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'result' };
	callback(null, payload, xmlOptions);
};

function postNewComment(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'result' };
	callback(null, payload, xmlOptions);
};

function newAPIKey(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'result' };
	callback(null, payload, xmlOptions);
};