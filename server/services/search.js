var utl = require('./utilities');
var dbase = require('./database');

function SearchService() {
    var searchSvc = {
        getSearchTerms: function (params, callback) {
            dbase.executeSelectProcedure("sca_wayfinder.search_getall", params, function (result, error) {
                callback(result, error);
            });
        },
        add: function (params, callback) {
            dbase.executeAddProcedure("sca_wayfinder.search_add", params, function (result, error) {
                callback(result, error);
            });
        }
    }

    return searchSvc;
}

module.exports = SearchService();