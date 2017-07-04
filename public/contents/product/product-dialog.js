mainApp.controller("productDialogCtrl", function ($scope, $http, $mdDialog, Dialog) {
    // declare variable
    var dialogSvc = new Dialog();
    $scope.header = $scope.dialogHeader;
    $scope.product = {
        Id: 0,
        StoreId: $scope.store.StoreId,
        Name: "",
        AisleNumber: [],
        CategoryId: 0,
        Occasion: "",
        Comments: ""
    };

    // set product to selected product when editing
    if ($scope.header.toLowerCase().indexOf("edit") > -1) {
        $scope.product = JSON.parse(JSON.stringify($scope.selectedProduct));
    }
    $scope.savingFlag = false;

    $scope.addNewCategory = function (ev) {
        $scope.dialogHeader = "Add Category";
        dialogSvc.showDialog("categoryDialogCtrl", $scope, "/contents/category/category-dialog.html", false, "parent", ev)
            .then(function (response) {
                console.log(response);
            });
    }

    $scope.save = function (isFormValid, ev) {
        if (!isFormValid) return;

        $scope.savingFlag = true;

        if ($scope.header.toLowerCase().indexOf("edit") > -1) {
            $http({
                method: "PUT",
                url: "/api/product/edit",
                data: $scope.product
            }).then(function (response) {
                if (response.data.success) {
                    dialogSvc.showAlert("Information", "Successfully edited.", "Ok", true, "parent", ev)
                        .then(function () {
                            $mdDialog.hide($scope.product);
                        });
                }
                $scope.savingFlag = false;
            }, function (error) {
                console.log(error);
                $scope.savingFlag = false;
            });
        } else {
            $http({
                method: "POST",
                url: "/api/product/add",
                data: $scope.product
            }).then(function (response) {
                if (response.data.success) {
                    dialogSvc.showAlert("Information", "New product added.", "Ok", true, "parent", ev)
                        .then(function () {
                            $mdDialog.hide(response.data.row);
                        });
                }
                $scope.savingFlag = false;
            }, function (error) {
                console.log(error);
                $scope.savingFlag = false;
            });
        }
    }
});