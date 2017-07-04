mainApp.controller("importDialogCtrl", function ($scope, $http, Dialog, $mdDialog) {

    // variable declaration
    var dialogSvc = new Dialog();
    $scope.loadingFlag = false;
    $scope.importDialog = {
        isCheckedAll: false,
        sheetNumber: "",
        totalSheet: 1
    };
    $scope.sheetNumber = 1;


    $scope.loadFile = function () {
        $scope.listImport = [];
        $scope.isTableVisible = false;
        $scope.importDialog.sheetNumber = "";
    }
    $scope.loadFile();

    $scope.upload = function () {
        var data = new FormData();
        $('#uploadForm input[type="file"]').each(function () {
            $.each(this.files, function (i, file) {
                data.append('myFile', file);
            });
        });

        $scope.loadingFlag = true;
        $.ajax({
            url: "http://localhost:3000/api/import/upload?sheet=" + $scope.sheetNumber,
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success) {
                    $scope.listImport = res.rows;
                    $scope.filename = res.filename;
                    $scope.importDialog.totalSheet = res.worksheetNumber;
                    $scope.isTableVisible = true;
                    $scope.loadingFlag = false;
                    console.log(res);
                    $scope.$digest();
                } else {
                    console.log(res);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    $scope.checkAll = function (_bool) {
        $scope.listImport.filter(obj => obj.SheetNumber.toString().indexOf($scope.importDialog.sheetNumber.toString()) > -1)
            .forEach((value, key) => {
                value.isChecked = $scope.importDialog.isCheckedAll;
            });
    }

    $scope.toggleCheckAll = function () {
        $scope.isCheckedAll = false;
    }

    $scope.import = function (type, ev) {
        // type 
        // 0 - selected
        // 1 - all
        var msg = "Are you sure you want to all " + (type === 0 ? "selected " : "") + "?";
        dialogSvc.showConfirm("Confirmation", msg, "Yes", "No", false, "parent", ev)
            .then(function (res) {
                if (res) { // If yes
                    var importList = [];

                    angular.forEach($scope.listImport, function (value, key) {
                        if (value.isChecked || type === 1) {
                            var newObj = JSON.parse(JSON.stringify(value));
                            delete newObj["isChecked"];
                            delete newObj["$$hashKey"];
                            delete newObj["SheetNumber"];
                            importList.push(newObj);
                        }
                    });

                    if (importList.length > 0) {
                        $http({
                            method: "POST",
                            url: "/api/import/stores",
                            data: {
                                userid: $scope.global.currentUser.id,
                                listStore: importList
                            }
                        }).then(function successCallback(res) {
                            if (res.data.data.success) {
                                $mdDialog.hide(true);
                            }
                        }, function errorCallback(err) {
                            console.log(err);
                        });
                    } else {
                        dialogSvc.showAlert("Warning", "Nothing to import", "Ok", true, "parent", ev);
                    }
                }
            });
    }

    $scope.range = function (min, max, step) {
        var step = step || 1;
        var _res = [];
        for (var i = min; i <= max; i += step) {
            _res.push(i);
        }
        return _res;
    }

    $scope.removeAllSelected = function () {
        $scope.importDialog.isCheckedAll = false;
        $scope.listImport.forEach(obj => obj.isChecked = false);
    }
});