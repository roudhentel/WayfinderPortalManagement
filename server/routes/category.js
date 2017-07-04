var express = require('express');
var categorySvc = require('../services/category');

function CategoryRoute() {
    var router = express.Router();

    router.get('/getAll', function (request, response) {
        categorySvc.get(function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.post('/add', function (request, response) {
        var params = [
            request.body.name
        ];
        categorySvc.add(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    router.put('/edit', function (request, response) {
        var params = [
            request.body.id,
            request.body.name
        ];
        categorySvc.edit(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    router.delete('/delete', function (request, response) {
        var params = [
            request.query.id
        ];
        categorySvc.delete(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    return router;
}

module.exports = CategoryRoute();