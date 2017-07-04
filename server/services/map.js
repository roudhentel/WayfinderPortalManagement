var dbservice = require('./database');
var fs = require('fs');

function MapService() {
    var mapserv = {
        getAll: function (params, callback) {
            dbservice.executeSelectProcedure("sca_wayfinder.map_getall", params, function (result, error) {
                callback(result, error);
            });
        },
        getAllByUuid: function (params, callback) {
            dbservice.executeSelectProcedure("sca_wayfinder.map_getallbyuuid", params, function (result, error) {
                callback(result, error);
            });
        },
        getAllRoutesByUuid: function (params, callback) {
            dbservice.executeSelectProcedure("sca_wayfinder.map_getallroutesbyuuid", params, function (result, error) {
                callback(result, error);
            });
        },
        setPrimary: function (params, callback) {
            dbservice.executeEditProcedure("sca_wayfinder.map_setprimary", params, function (result, error) {
                callback(result, error);
            });
        },
        editRoute: function (params, callback) {
            dbservice.executeEditProcedure("sca_wayfinder.map_editroute", params, function (result, error) {
                callback(result, error);
            });
        },
        add: function (params, callback) {
            dbservice.executeAddProcedure("sca_wayfinder.map_add", params, function (result, error) {
                callback(result, error);
            });
        },
        addMapRoute: function (params, callback) {
            dbservice.executeAddProcedure("sca_wayfinder.map_location_add", params, function (result, error) {
                callback(result, error);
            });
        },
        delete: function (params, callback) {
            dbservice.executeDeleteProcedure("sca_wayfinder.map_delete", params, function (result, error) {
                callback(result, error);
            });
        }
    }

    return mapserv;
}

module.exports = MapService();