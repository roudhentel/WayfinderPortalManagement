mainApp.controller("categoryDialogCtrl", function ($scope, $http, Dialog, $mdDialog) {
    // variable declaration
    var dialogSvc = new Dialog();
    $scope.header = $scope.dialogHeader;
    $scope.category = {
        Id: 0,
        Name: ""
    }
    $scope.savingFlag = false;

    $scope.save = function (isFormValid, ev) {
        if (!isFormValid) return;

        $scope.savingFlag = true;
        $http({
            method: "POST",
            url: "/api/category/add",
            data: {
                name: $scope.category.Name
            }
        }).then(function (result) {
            $scope.savingFlag = false;
            if (result.data.success) {
                $scope.listCategories.push(result.data.row);
                dialogSvc.showAlert("Information", "New category added.", "Ok", true, "parent", ev)
                    .then(function () {
                        $mdDialog.hide();
                    });
            }
        }, function (error) {
            console.log(error);
            $scope.savingFlag = false;
        });
    }
});