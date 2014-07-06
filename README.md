## Accela Open311

An Open311 server that integrates with Accela Automation.

## API Methods

### Get Service Request Types

<code>http://[API endpoint]/services.[format]</code>

HTTP Method: GET

Parameters:
* jurisdiction_id (Required)

Sample Response:

```json
[
  {
    "module": "ServiceRequest",
    "service_code": "ServiceRequest/Animals/Animal Nuisance/NA",
    "value": "ServiceRequest-Animals-Animal.cNuisance-NA",
    "metadata": false,
    "type": "realtime",
    "keywords": "Animal Nuisance",
    "group": "ServiceRequest",
    "service_name": "Animals",
    "description": "Animal Nuisance"
  },
  {
    "module": "ServiceRequest",
    "service_code": "ServiceRequest/Buildings and Property/Fence Dispute/NA",
    "value": "ServiceRequest-Buildings.cand.cProperty-Fence.cDispute-NA",
    "metadata": false,
    "type": "realtime",
    "keywords": "Fence Dispute",
    "group": "ServiceRequest",
    "service_name": "Buildings and Property",
    "description": "Fence Dispute"
  }
]
```

### Get Service Request Details

Method not implemented.

### Get Service Request ID from Token

Method not implemented.

### Get List of Service Requests

<code>http://[API endpoint]/requests.[format]</code>

HTTP Method: GET

Parameters:
* jurisdiction_id (Required)
* limit
* offset

Sample Response:

```json
[
    {
        "address": "", 
        "agency_responsible": null, 
        "description": null, 
        "media_url": "http://thisisface.com", 
        "requested_datetime": null, 
        "service_code": "ServiceRequest-Water.cand.cSewage-Leaking.cFire.cHydrant-NA", 
        "service_name": "Leaking Fire Hydrant", 
        "service_request_id": "ISLANDTON-14CAP-00000-00070", 
        "status": "Received", 
        "updated_datetime": null
    }, 
    {
        "address": "", 
        "agency_responsible": null, 
        "description": null, 
        "media_url": "http://thisisface.com", 
        "requested_datetime": null, 
        "service_code": "ServiceRequest-Water.cand.cSewage-Leaking.cFire.cHydrant-NA", 
        "service_name": "Leaking Fire Hydrant", 
        "service_request_id": "ISLANDTON-14CAP-00000-00073", 
        "status": "Received", 
        "updated_datetime": null
    }
]
```

### Get a Specific Service Request

<code>http://[API endpoint]/requests/[service_request_id].[format]</code>

HTTP Method: GET

Parameters
* jurisdiction_id (Required)
* service_request_id (Required)

Sample Response:

```json
[
    {
        "address": "", 
        "agency_responsible": null, 
        "description": "This is the description.", 
        "media_url": "http://thisisface.com", 
        "requested_datetime": null, 
        "service_code": "ServiceRequest-Water.cand.cSewage-Leaking.cFire.cHydrant-NA", 
        "service_name": "Leaking Fire Hydrant", 
        "service_request_id": "ISLANDTON-14CAP-00000-00074", 
        "status": "Received", 
        "updated_datetime": "2014-07-02 18:23:44"
    }
]
```
### Create a New Service Request

HTTP Method: POST

Parameters:
* jurisdiction_id (Required)
* key (Required)
* 

