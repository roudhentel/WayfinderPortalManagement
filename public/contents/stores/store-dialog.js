mainApp.controller("storeDialogCtrl", function ($scope, $mdDialog, StoreService) {
    var storeSvc = new StoreService();
    $scope.store = {
        StoreId: 0,
        Name: "",
        UUID: "",
        Address: "",
        ContactNumber: ""
    };

    if ($scope.dialogHeader.toLowerCase() === ("Edit Store").toLowerCase()) {
        $scope.store = JSON.parse(JSON.stringify($scope.selectedStore));
        //$scope.store = $scope.selectedStore;
    }

    $scope.savingFlag = false;

    $scope.save = function (isFormValid) {
        if (!isFormValid) return;

        $scope.savingFlag = true;
        if ($scope.dialogHeader.toLowerCase() === ("Edit Store").toLowerCase()) {
            // update
            storeSvc.edit({
                "storeid": $scope.store.StoreId,
                "uuid": $scope.store.UUID,
                "name": $scope.store.Name,
                "address": $scope.store.Address,
                "contactno": $scope.store.ContactNumber
            }).then(function successCallback(res) {
                if (res.data.success) {
                    $mdDialog.hide($scope.store);
                } else {
                    $mdDialog.hide(undefined);
                }
                $scope.savingFlag = false;
            }, function errorCallback(err) {
                $scope.savingFlag = false;
                console.log(err);
            });
        } else {
            // add new
            storeSvc.add({
                userid: $scope.global.currentUser.id,
                uuid: $scope.store.UUID,
                name: $scope.store.Name,
                address: $scope.store.Address,
                contactno: $scope.store.ContactNumber
            }).then(function successCallback(res) {
                if (res.data.success) {
                    $mdDialog.hide(res.data.row);
                }
                $scope.savingFlag = false;
            }, function errorCallback(err) {
                $scope.savingFlag = false;
                console.log(err);
            });
        }
    }
});