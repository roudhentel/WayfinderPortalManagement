var express = require('express');
var aisleSvc = require('../services/aisle');

function AisleRoute() {
    var router = express.Router();

    router.get('/getByStoreId', function (request, response) {
        var params = [
            request.query.id
        ];

        aisleSvc.getByStoreId(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.get('/getRoutes', function (request, response) {
        var params = [
            request.query.mapid,
            request.query.aisleid || 0
        ];
        aisleSvc.getRoutes(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.get('/getProducts', function (request, response) {
        var params = [
            request.query.aisleid
        ];
        aisleSvc.getProducts(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.post('/add', function (request, response) {
        var params = [
            request.body.MapId,
            request.body.Description,
            request.body.X,
            request.body.Y,
            request.body.Width,
            request.body.Height,
            request.body.Rx,
            request.body.Ry,
            request.body.Points,
            request.body.Type
        ];
        aisleSvc.add(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    router.post('/copy', function (request, response) {
        var params = [
            request.body.fromMapId,
            request.body.toMapId,
        ];

        aisleSvc.copy(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data); 
            }
        });
    });

    router.put('/edit', function (request, response) {
        var params = [
            request.body.Id,
            request.body.Description,
            request.body.X,
            request.body.Y,
            request.body.Width,
            request.body.Height,
            request.body.Rx,
            request.body.Ry,
            request.body.Points,
            request.body.Type
        ];
        aisleSvc.edit(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.delete('/delete', function (request, response) {
        var params = [
            request.query.id
        ];
        aisleSvc.delete(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    // aisle route
    router.get('/getRoutesByUuid', function (request, response) {
        var params = [
            request.query.storeuuid,
            request.query.mapid,
            request.query.aisleid
        ];

        aisleSvc.getRoutesByUuid(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.post('/addRoute', function (request, response) {
        var params = [
            request.body.MapId,
            request.body.AisleId,
            request.body.Coordinates
        ];
        aisleSvc.addRoute(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    router.put('/editRoute', function (request, response) {
        var params = [
            request.body.Id,
            request.body.Coordinates
        ];
        aisleSvc.editRoute(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.delete('/deleteRoute', function (request, response) {
        var params = [
            request.query.id
        ];
        aisleSvc.deleteRoute(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    return router;
}

module.exports = AisleRoute();