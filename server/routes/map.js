var express = require('express');
var mapSvc = require('../services/map');

function MapRoute() {
    var router = express.Router();

    router.get('/getall', function (request, response) {
        var storeid = request.headers.storeid || request.query.storeid || 0;
        mapSvc.getAll([storeid], function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.get('/getallbyuuid', function (request, response) {
        var uuid = request.headers.uuid || request.query.uuid || 0;
        mapSvc.getAllByUuid([uuid], function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.get('/getallroutesbyuuid', function (request, response) {
        var uuid = request.headers.uuid || request.query.uuid || 0;
        mapSvc.getAllRoutesByUuid([uuid], function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.put('/setprimary', function (request, response) {
        var params = [
            request.body.id,
            request.body.storeid
        ];

        mapSvc.setPrimary(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.put('/editRoute', function (request, response) {
        var params = [
            request.body.id,
            request.body.coordinates
        ];

        mapSvc.editRoute(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.post('/add', function (request, response) {
        var params = [
            request.body.storeid,
            request.body.filename,
            request.body.width,
            request.body.height
        ];

        mapSvc.add(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.post('/addMapRoute', function (request, response) {
        var params = [
            request.body.mapid,
            request.body.productid,
            request.body.coordinates
        ];

        mapSvc.addMapRoute(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    router.delete('/delete', function (request, response) {
        var params = [
            request.query.id
        ];

        mapSvc.delete(params, function (result, error) {
            if (!error) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    return router;
}

module.exports = MapRoute();