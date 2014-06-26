// Design document for CouchDB.
{
    "_id": "_design/type",
    "language": "javascript",
    "views": {
        "comments": {
            "map": "function(doc) {\n  if(doc.type == 'comment') {\n   emit(null, { jurisdiction_id: doc.jurisdiction_id, request_id: doc.service_request_id, comment: doc.comment });\n  }\n}"
        },
        "keys": {
            "map": "function(doc) {\n  if(doc.type == 'key') {\n   emit(null, doc);\n  }\n}"
        }
    },
    "lists": {
        "get-comments": "function(head, req) { var row; start({ headers: { 'Content-Type': 'application/json' } }); var response = []; while(row = getRow()) { if(req.query.request_id == row.value.request_id) { response.push({ jurisdiction_id: row.value.jurisdiction_id, request_id: row.value.request_id, comment: row.value.comment }); } } send(JSON.stringify(response)); }"
    }
}