var dbservice = require('./database');
var fs = require('fs');

function StoreService() {
    var storeserv = {
        getByUuid: function (params, callback) {
            dbservice.executeSelectProcedure("sca_wayfinder.store_getbyuuid", params, function (result, error) {
                callback(result, error);
            });
        },
        getAll: function (params, callback) {
            var _this = this;
            dbservice.executeSelectProcedure("sca_wayfinder.user_stores", params, function (result, error) {
                //callback(result, error);
                if (!error && result.data.rows.length > 0) {
                    _this.getDefaultPhoto(0, result, error, callback);
                }
            });
        },
        getLimit: function (params, callback) {
            var _this = this;
            dbservice.executeSelectProcedure("sca_wayfinder.store_getlimit", params, function (result, error) {
                // set default image
                if (!error && result.data.rows.length > 0) {
                    _this.getDefaultPhoto(0, result, error, callback);
                }
                //callback(result, error);
            });
        },
        getDefaultPhoto: function (idx, result, error, callback) {
            var _this = this;
            if (idx < result.data.rows.length) {
                fs.readdir('./public/assets/images/stores/' + result.data.rows[idx].StoreId, function (err, files) {
                    if (err) {
                        result.data.rows[idx]["defaultImage"] = "";
                    } else {
                        var defaultImg = files.find(obj => obj.indexOf('default') > -1);
                        result.data.rows[idx]["DefaultImage"] = defaultImg ? defaultImg : "";
                    }
                    _this.getDefaultPhoto(++idx, result, error, callback);
                });
            } else if (idx == result.data.rows.length) {
                callback(result, error);
            }
        },
        add: function (params, callback) {
            dbservice.executeAddProcedure("sca_wayfinder.store_add", params, function (result, error) {
                callback(result, error);
            });
        },
        edit: function (params, callback) {
            dbservice.executeEditProcedure("sca_wayfinder.store_update", params, function (result, error) {
                callback(result, error);
            })
        },
        delete: function (params, callback) {
            dbservice.executeDeleteProcedure("sca_wayfinder.store_delete", params, function (result, error) {
                callback(result, error);
            });
        },
        updateFavorite: function (params, callback) {
            dbservice.executeEditProcedure("sca_wayfinder.favorite_update", params, function (result, error) {
                callback(result, error);
            });
        }
    }

    return storeserv;
}

module.exports = StoreService();