var db = require('./dbcredentials');
var mysql = require('mysql');

function DBService() {
    var dbserv = {
        executeQuery: function (query, parameters, callback) {
            var connection = mysql.createConnection(db);

            connection.connect(function (err) {
                if (!err) {
                    connection.query(query, [parameters], function (err, rows, fields) {
                        connection.end();
                        if (!err) {
                            callback(rows, undefined)
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    callback(undefined, err);
                }
            });
        },
        executeProcedure: function (procname, parameters, callback) {
            var connection = mysql.createConnection(db);
            var params = "";

            for (var item in parameters) {
                params += "?,"
            }
            params = params.substring(0, params.length - 1);

            var query = "call " + procname + "(" + params + ");";
            connection.connect(function (error) {
                if (!error) {
                    connection.query(query, parameters, function (err, rows, fields) {
                        connection.end();
                        if (!err) {
                            callback(rows, undefined)
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    callback(undefined, error);
                }
            });
        },
        executeAddProcedure: function (procname, parameters, callback) {
            this.executeProcedure(procname, parameters, function (result, error) {
                if (!error) {
                    if (result[0]) {
                        // if saving to database success
                        callback({
                            status: 200,
                            data: {
                                success: true,
                                row: result[0][0]
                            }
                        }, undefined);
                    } else {
                        callback(undefined, {
                            status: 200,
                            data: {
                                success: false,
                                message: "No row(s) added."
                            }
                        });
                    }
                } else {
                    console.log(error);
                    callback(undefined, {
                        status: 500,
                        data: {
                            success: false,
                            details: error,
                            message: "Server Error"
                        }
                    });
                }
            });
        },
        executeEditProcedure: function (procname, parameters, callback) {
            this.executeProcedure(procname, parameters, function (result, error) {
                if (!error) {
                    if (result.affectedRows > 0) {
                        callback({
                            status: 200,
                            data: { success: true }
                        }, undefined);
                    } else {
                        callback({
                            status: 200,
                            data: {
                                success: false,
                                message: "No row(s) affected"
                            }
                        }, undefined);
                    }
                } else {
                    console.log(error);
                    callback(undefined, {
                        status: 500,
                        data: {
                            success: false,
                            message: "Server Error",
                            details: error
                        }
                    });
                }
            });
        },
        executeDeleteProcedure: function (procname, parameters, callback) {
            this.executeProcedure(procname, parameters, function (result, error) {
                if (!error) {
                    if (result.affectedRows > 0) {
                        callback({
                            status: 200,
                            data: { success: true }
                        }, undefined);
                    } else {
                        callback({
                            status: 200,
                            data: {
                                success: false,
                                message: "No row(s) affected"
                            }
                        }, undefined);
                    }
                } else {
                    console.log(error);
                    callback(undefined, {
                        status: 500,
                        data: {
                            success: false,
                            details: error,
                            message: "Server Error."
                        }
                    });
                }
            });
        },
        executeSelectProcedure: function (procname, parameters, callback) {
            this.executeProcedure(procname, parameters, function (result, error) {
                if (!error) {
                    callback({
                        status: 200,
                        data: {
                            success: true,
                            rows: result[0]                           
                        }
                    }, undefined);
                } else {
                    callback(undefined, {
                        status: 500,
                        message: "Server Error",
                        details: error
                    });
                }
            });
        }
    }

    return dbserv;
}
module.exports = DBService();