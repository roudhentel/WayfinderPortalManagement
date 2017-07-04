var utl = require('./utilities');
var dbase = require('./database');

function CategoryService() {
    var categorySvc = {
        get: function (callback) {
            dbase.executeSelectProcedure("sca_wayfinder.category_get", [], function (result, error) {
                callback(result, error);
            });
        },
        add: function (params, callback) {
            dbase.executeAddProcedure("sca_wayfinder.category_add", params, function (result, error) {
                callback(result, error);
            });
        },
        edit: function (params, callback) {
            dbase.executeEditProcedure("sca_wayfinder.category_update", params, function (result, error) {
                callback(result, error);
            });
        },
        delete: function (params, callback) {
            dbase.executeDeleteProcedure("sca_wayfinder.category_delete", params, function (result, error) {
                callback(result, error);
            });
        }
    }

    return categorySvc;
}

module.exports = CategoryService();