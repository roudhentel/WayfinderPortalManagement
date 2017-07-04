mainApp.factory("StoreService", function (Dialog, $http) {
    var dialogSvc = new Dialog();
    function Store() {

    }

    Store.prototype = {
        showDialog: function (ev, scope, templateUrl) {
            return dialogSvc.showDialog("storeDialogCtrl", scope, templateUrl, true, "parent", ev);
        },
        showImportDialog: function (ev, scope, templateUrl) {
            return dialogSvc.showDialog("importDialogCtrl", scope, templateUrl, false, "parent", ev);
        },
        getall: function (userid) {
            return $http({
                method: "GET",
                url: "/api/store/getall",
                params: {
                    userid: userid
                }
            }).then(function successCallback(res) {
                return res;
            }, function errorCallback(err) {
                return err;
            });
        },
        add: function (data) {
            return $http({
                method: "POST",
                url: "/api/store/add",
                data: data
            }).then(function successCallback(res) {
                return res;
            }, function errorCallback(err) {
                return err;
            });
        },
        edit: function (data) {
            return $http({
                method: "PUT",
                url: "/api/store/edit",
                data: data
            }).then(function successCallback(res) {
                return res;
            }, function errorCallback(err) {
                return err;
            });
        },
        delete: function (id) {
            return $http({
                method: "DELETE",
                url: "/api/store/delete",
                params: { storeid: id }
            }).then(function successCallback(res) {
                return res;
            }, function errorCallback(err) {
                return err;
            });
        }
    }

    return Store;
});