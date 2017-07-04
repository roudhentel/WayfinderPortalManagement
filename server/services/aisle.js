var utl = require('./utilities');
var dbase = require('./database');

function AisleService() {
    var aisleSvc = {
        getByStoreId: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.aisle_getbystoreid", params, function (result, error) {
                callback(result, error);
            });
        },
        getRoutes: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.aisle_getroutes", params, function (result, error) {
                callback(result, error);
            });
        },
        getProducts: function (callback) {
            dbase.executeSelectProcedure("sca_wayfinder.aisle_getproducts", params, function (result, error) {
                callback(result, error);
            });
        },
        add: function (params, callback) {
            dbase.executeAddProcedure("sca_wayfinder.aisle_add", params, function (result, error) {
                callback(result, error);
            });
        },
        // copy: function (params, callback) {
        //     dbase.executeSelectProcedure("sca_wayfinder.aisle_copy", params, function (result, error) {
        //         callback(result, error);
        //     });
        // },
        copy: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.aisle_copy", params, function (result, error) {
                callback(result, error);
            });
        },
        edit: function (params, callback) {
            dbase.executeEditProcedure("sca_wayfinder.aisle_update", params, function (result, error) {
                callback(result, error);
            });
        },
        delete: function (params, callback) {
            dbase.executeDeleteProcedure("sca_wayfinder.aisle_delete", params, function (result, error) {
                callback(result, error);
            });
        },
        getRoutesByUuid: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.aisle_route_getbyuuid", params, function (result, error) {
                callback(result, error);
            });
        },
        editRoute: function (params, callback) {
            dbase.executeEditProcedure("sca_wayfinder.aisle_route_edit", params, function (result, error) {
                callback(result, error);
            });
        },
        deleteRoute: function (params, callback) {
            dbase.executeDeleteProcedure("sca_wayfinder.aisle_route_delete", params, function (result, error) {
                callback(result, error);
            });
        },
        addRoute: function (params, callback) {
            dbase.executeAddProcedure("sca_wayfinder.aisle_route_add", params, function (result, error) {
                callback(result, error);
            });
        }
    }

    return aisleSvc;
}

module.exports = AisleService();