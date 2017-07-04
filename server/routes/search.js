var express = require('express');
var searchSvc = require('../services/search');

function SearchRoute() {
    var router = express.Router();

    router.get('/getSearchTerms', function (request, response) {
        var params = [
            request.query.uuid || "",
            request.query.deviceid || "0"
        ];
        searchSvc.getSearchTerms(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.post('/add', function (request, response) {
        var params = [
            request.body.searchText,
            request.body.storeUuid,
            request.body.deviceId
        ]

        searchSvc.add(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    return router;
}

module.exports = SearchRoute();