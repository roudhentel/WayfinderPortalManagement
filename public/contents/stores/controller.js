mainApp.controller("storesCtrl", function ($scope, $state, $http, Dialog, StoreService) {
    // variable declaration and initialisation
    var storeSvc = new StoreService();
    var dialogSvc = new Dialog();
    // declare in main controller to be accessible to all pages
    $scope.dialogHeader = "";
    $scope.selectedStore = {};

    $scope.global.listStore = [];

    $scope.showAddDialog = function (ev) {
        $scope.dialogHeader = "Add New Store";
        storeSvc.showDialog(ev, $scope, "contents/stores/store-dialog.html")
            .then(function (res) {
                if (res) {
                    res["StoreId"] = res["Id"];
                    $scope.global.listStore.push(res);
                    $scope.rebuildTable();
                }
            });
    }

    $scope.showEditDialog = function (ev, selItem, idx) {
        $scope.dialogHeader = "Edit Store";
        $scope.selectedStore = selItem;
        storeSvc.showDialog(ev, $scope, "contents/stores/store-dialog.html")
            .then(function (res) {
                if (res) {
                    $scope.global.listStore[idx] = res;
                    $scope.rebuildTable();
                }
            });
    }

    $scope.showImportDialog = function (ev) {
        storeSvc.showImportDialog(ev, $scope, "contents/stores/import-dialog.html")
            .then(function (res) {
                if (res) {
                    getAllStore();
                }
            });
    }

    $scope.deleteStore = function (ev, item, idx) {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete " + item.Name + " ?", "Yes", "No", false, "parent", ev)
            .then(function (res) {
                if (res) {
                    storeSvc.delete(item.StoreId)
                        .then(function successCallback(res) {
                            if (res.data.success) {
                                $scope.global.listStore.splice(idx, 1);
                                $scope.rebuildTable();
                                dialogSvc.showAlert("Information", "Successfully deleted", "Ok", true, "parent", ev);
                            }
                        }, function errorCallback(err) {
                            console.log(err);
                        });
                }
            })
    }

    var getAllStore = function () {
        $http({
            method: "GET",
            url: "/api/store/getall",
            params: {
                userid: $scope.global.currentUser.id
            }
        }).then(function successCallback(res) {
            $scope.global.listStore = res.data.rows;
            $scope.rebuildTable();
        }, function errorCallback(err) {
            console.log(err);
        });
    }

    $scope.rebuildTable = function () {
        if ($scope.storeTbl) $scope.storeTbl.destroy();
        createDataTable();
    }

    var createDataTable = function () {
        setTimeout(function () {
            $scope.storeTbl = $("#tblListStore").DataTable({
                "columns": [
                    { "width": "5%" }, // Action
                    { "width": "15%" }, // UUID
                    { "width": "15%" }, // Name
                    { "width": "30%" }, // Address
                    { "width": "15%" }, // Contact Number
                    { "width": "10%" }, // Date Added
                    { "width": "10%" }  // Date Modified
                ]
            });
        }, 100);
    }

    $scope.gotoStore = function (store) {
        $state.go('home.store.data', { store: store.StoreId, from: 'stores' });
    }

    // check params if data needs to be reloaded once page is activated
    if ($state.params.reloadData) {
        getAllStore();
    } else {
        createDataTable();
    }

});