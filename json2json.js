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
		    'service_code': payload.result[i].value || null,
		    'value': payload.result[i].id || null,
		    'metadata': false,
		    'type': 'realtime',
		    'keywords': payload.result[i].subType || null,
		    'group': payload.result[i].group || null,
		    'service_name': payload.result[i].type || null,
		    'description': payload.result[i].text || null,
		    'group': payload.result[i].group || null,
		    'module': payload.result[i].module
		}
		services.push(service);  
	}
	callback(null, services, xmlOptions);
};

function getServiceDefinition(payload, jurisdiction_id, callback) { 
	var xmlOptions = { rootName: 'result' };
	callback(null, payload, xmlOptions);
};

function getSeviceRequests(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'requests', wrapArray: { enabled: true }, wrapArrayItem: 'request' };
	requests = formatServiceRequests(payload.result);
	callback(null, requests, xmlOptions);
};

function getSpecificSeviceRequest(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'requests', wrapArray: { enabled: true }, wrapArrayItem: 'request' };
	request = formatServiceRequests(payload.result);
	callback(null, request, xmlOptions);
};

function getRequestComments(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'comments', wrapArray: { enabled: true }, wrapArrayItem: 'comment' };
	callback(null, payload, xmlOptions);
};

function postServiceRequests(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'service_requests', wrapArray: { enabled: true }, wrapArrayItem: 'request' };
	response = [{ service_request_id: payload.result.id}]
	callback(null, response, xmlOptions);
};

function postNewComment(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'comments', wrapArray: { enabled: true }, wrapArrayItem: 'comment' };
	callback(null, payload, xmlOptions);
};

function newAPIKey(payload, jurisdiction_id, callback) {
	var xmlOptions = { rootName: 'result' };
	callback(null, payload, xmlOptions);
};

function formatServiceRequests(payload) {
	var requests = [];
	for(var i=0; i<payload.length; i++) {
		var address = state =  status = streetSuffix = '';
		if(payload[i].addresses) {
		//	if(payload[i].addresses.isPrimary == 'Y') {
				var streetStart = payload[i].addresses[0].streetStart || '';
				var streetName = payload[i].addresses[0].streetName || '';
				var city = payload[i].addresses[0].city || '';
				var postalCode = payload[i].addresses[0].postalCode || '';
				if(payload[i].addresses[0].streetSuffix !== undefined) {
					var streetSuffix = payload[i].addresses[0].streetSuffix.text || '';
				}
				if(payload[i].addresses[0].state !== undefined) {
					var state = payload[i].addresses[0].state.text || '';
				}
				var address_id = payload[i].addresses[0].id  || null;
				var zipcode = payload[i].addresses[0].postalCode  || null;

				address = streetStart + ' ' + streetName + ' ' + streetSuffix;
				address += city.length > 0 ? ', ' + city : '';
				address += state.length > 0 ? ', ' + state : '';

				var lat = payload[i].addresses[0].xCoordinate  || null;
				var lon = payload[i].addresses[0].yCoordinate  || null;
		//	}
		}
		if(payload[i].status) {
			status = payload[i].status.text;
		}

		var request = {
		    'service_request_id': payload[i].id,
		    'status': status,
		    'service_name': payload[i].type.text || null,
		    'service_code': payload[i].type.id || null,
		    'description': payload[i].description || null,
		    'agency_responsible': payload[i].assignedToDepartment || null,
		    'requested_datetime': payload[i].reportedDate || null,
		    'updated_datetime': payload[i].statusDate || null,
		    'address': address,
		    'address_id': address_id,
		    'zipcode': zipcode,
		    'lat': lat,
		    'long': lon,
		    'media_url': null
		}
		requests.push(request);
	}
	return requests;
}