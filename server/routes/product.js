var express = require('express');
var productSvc = require('../services/product');

function CategoryRoute() {
    var router = express.Router();

    router.get('/getAll', function (request, response) {
        var params = [
            request.query.storeid
        ];
        productSvc.get(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.get('/getAllByUuid', function (request, response) {
        var params = [
            request.query.uuid
        ];
        productSvc.getByUuid(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.get('/getProductRoutes', function (request, response) {
        var params = [
            request.query.productid
        ];

        productSvc.getProductRoutes(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        });
    });

    router.post('/add', function (request, response) {
        var params = [
            request.body.StoreId,
            request.body.Name,
            request.body.AisleNumber.join(),
            request.body.CategoryId,
            request.body.Occasion,
            request.body.Comments
        ];
        productSvc.add(params, function (result, error) {
            if (error) {
                response.status(error.status).json(error.data);
            } else {
                response.status(result.status).json(result.data);
            }
        })
    });

    router.put('/edit', function (request, response) {
        var params = [
            request.body.Id,
            request.body.StoreId,
            request.body.Name,
            request.body.AisleNumber.join(),
            request.body.CategoryId,
            request.body.Occasion,
            request.body.Comments
        ];
        productSvc.edit(params, function (result, error) {
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
        productSvc.delete(params, function (result, error) {
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