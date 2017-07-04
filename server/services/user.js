var bcrypt = require('bcrypt');
var dbservice = require('./database');

function UserService() {
    var userserv = {
        authenticate: function (username, password, callback) {
            // execute stored procedure that will look up for the username
            dbservice.executeProcedure("sca_wayfinder.user_authenticate", [username],
                function (result, error) {
                    if (!error && result[0][0]) {
                        // when username and password match / Success
                        var success = bcrypt.compareSync(password, result[0][0].Password)
                        callback({
                            success: success,
                            token: "",
                            user: result[0][0]
                        }, undefined);
                    } else {
                        callback(undefined, error);
                    }
                });
        },
        add: function (userData, callback) {
            // execute stored procedure that will add new user from the database.
            dbservice.executeAddProcedure("sca_wayfinder.user_add", userData, function (result, error) {
                callback(result, error);
            });
        },
        delete: function (userId, callback) {
            dbservice.executeDeleteProcedure("sca_wayfinder.user_delete", [userId], function (result, error) {
                callback(result, error);
            });
        },
        edit: function (userData, callback) {
            dbservice.executeEditProcedure("sca_wayfinder.user_update", userData, function (result, error) {
                callback(result, error);
            });
        },
        checkIfExist: function (userData, callback) {
            dbservice.executeSelectProcedure("sca_wayfinder.user_checkifexist", userData, function (result, error) {
                if (!error) {
                    callback({
                        status: 200,
                        data: { success: true, isexist: result.data.rows.length > 0 }
                    }, error);
                } else {
                    callback(result, error);
                }
            });
        }
    }

    return userserv;
}

module.exports = UserService();