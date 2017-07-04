var utl = require('./utilities');
var dbase = require('./database');

function ProductService() {
    var productSvc = {
        get: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.product_get", params, function (result, error) {
                callback(result, error);
            });
        },
        getByUuid: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.product_getByUuid", params, function (result, error) {
                callback(result, error);
            });
        },
        getProductRoutes: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.map_location_getproductroutes", params, function (result, error) {
                callback(result, error);
            });
        },
        add: function (params, callback) {
            dbase.executeAddProcedure("sca_wayfinder.product_add", params, function (result, error) {
                callback(result, error);
            });
        },
        edit: function (params, callback) {
            dbase.executeEditProcedure("sca_wayfinder.product_update", params, function (result, error) {
                callback(result, error);
            });
        },
        delete: function (params, callback) {
            dbase.executeDeleteProcedure("sca_wayfinder.product_delete", params, function (result, error) {
                callback(result, error);
            });
        }
    }

    return productSvc;
}

module.exports = ProductService();