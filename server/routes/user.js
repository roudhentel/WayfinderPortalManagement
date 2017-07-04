var express = require('express');
var bcrypt = require('bcrypt');
var userservice = require('../services/user');

function UserRoute() {
    var router = express.Router();
    var salt = bcrypt.genSaltSync(10);

    // authentication of users
    router.post('/authenticate', function (request, response) {
        userservice.authenticate(request.body.email, request.body.password,
            function (result, err) {
                if (!err) {
                    response.status(200).json(result);
                } else {
                    response.status(500).json(err);
                }
            });
    });

    // adding of users
    router.post('/add', function (request, response) {
        // get all needed data from post data
        var userData = [
            request.body.Email,
            bcrypt.hashSync(request.body.Password, salt),
            request.body.Fullname
        ];

        userservice.checkIfExist([request.body.Email], function (result, err) {
            if (!err) {
                if (!result.data.isexist) {
                    // if email doesnt exist save to db
                    userservice.add(userData, function (result1, err1) {
                        if (!err) {
                            response.status(result1.status).json(result1.data);
                        } else {
                            response.status(err1.status).json(err1.data);
                        }
                    });
                } else {
                    response.status(200).json({
                        "success": false,
                        "isuserexist": true
                    })
                }
            } else {
                response.status(500).json(err);
            }
        });


    });

    // deleting of users
    router.delete("/delete", function (request, response) {
        var id = request.headers['userid'] || request.query["userid"];

        if (id > 0) {
            userservice.delete(id, function (result, err) {
                if (!err) {
                    response.status(200).json(result);
                } else {
                    response.status(500).json(err);
                }
            });
        } else {
            response.json({
                success: false,
                message: "Invalid Id"
            });
        }
    });

    // editing of users
    router.put("/edit", function (request, response) {
        if (request.body.id > 0) {
            var userData = [
                request.body.id,
                request.body.email,
                bcrypt.hashSync(request.body.password, salt),
                request.body.fullname
            ];

            userservice.edit(userData, function (result, err) {
                if (!err) {
                    response.status(200).json(result);
                } else {
                    response.status(500).json(err);
                }
            });

        } else {
            response.json({
                success: false,
                id: "Invalid Id."
            });
        }
    });

    router.get("/checkIfExist", function (request, response) {
        var userData = [
            request.query.email
        ];

        userservice.checkIfExist(userData, function (result, err) {
            if (!err) {
                response.status(result.status).json(result.data);
            } else {
                response.status(error.status).json(error.data);
            }
        });
    });

    return router;
}

module.exports = UserRoute();