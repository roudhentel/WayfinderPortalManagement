var express = require('express');
var storeSvc = require('../services/store');

function StoreRoute() {
    var router = express.Router();

    router.get('/getall', function (request, response) {
        var userid = request.headers.userid || request.query.userid || 0;
        storeSvc.getAll([userid], function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        })
    });

    router.get('/getbyuuid', function (request, response) {
        var uuid = request.headers.uuid || request.query.uuid || 0;
        storeSvc.getByUuid([uuid], function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        })
    });

    router.get('/getlimit', function (request, response) {
        params = [
            request.query["start"] || 0,
            request.query["count"] || 0,
            request.query["userid"] || 0,
            request.query["isfavorite"] || 0
        ];

        storeSvc.getLimit(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.post('/add', function (request, response) {
        var params = [
            request.body.userid,
            request.body.uuid,
            request.body.name,
            request.body.address,
            request.body.contactno
        ];

        storeSvc.add(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.put('/edit', function (request, response) {
        var params = [
            request.body.storeid,
            request.body.uuid,
            request.body.name,
            request.body.address,
            request.body.contactno
        ];

        storeSvc.edit(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.delete('/delete', function (request, response) {
        var params = [
            request.query.storeid
        ];

        storeSvc.delete(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.put('/updateFavorite', function (request, response) {
        var params = [
            request.body.id,
            request.body.isfavorite
        ]

        storeSvc.updateFavorite(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    return router;
}

module.exports = StoreRoute();