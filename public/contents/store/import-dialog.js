mainApp.controller("importProdDialogCtrl", function ($scope, $http, Dialog, $mdDialog) {

    // variable declaration
    var dialogSvc = new Dialog();
    $scope.loadingFlag = false;
    $scope.importDialog = {
        isCheckedAll: false,
        sheetNumber: "",
        totalSheet: 1
    };
    $scope.sheetNumber = 1;
    $scope.savingFlag = false;


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
            url: "/api/import/uploadProducts",
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

                    $scope.listImport.forEach(item => {
                        var cat = $scope.listCategories.find(obj => item["Category"] !== "" && obj.Name.toLowerCase().indexOf(item["Category"].toLowerCase()) > -1);
                        item["CategoryId"] = cat ? cat.Id : 0;

                        var aisleArr = item.AisleNumber.toString().split(",");
                        var aislenumber = [];
                        var aisleDesc = [];
                        aisleArr.forEach(desc => {
                            var aisles = $scope.listAisle.filter(obj => obj.Description.toLowerCase().indexOf(desc.toLowerCase()) > -1 && obj.MapId === $scope.selMapId);
                            var aisle = undefined;
                            if (aisles.length > 0) {
                                if (aisles.length > 1) {
                                    aisles.forEach(a => {
                                        if (aisle) {
                                            if (aisle.Description.length > a.Description.length) {
                                                aisle = a;
                                            }
                                        } else {
                                            aisle = a;
                                        }
                                    });
                                } else {
                                    // if length equal to 1
                                    aisle = $scope.listAisle.find(obj => obj.Description.toLowerCase().indexOf(desc.toLowerCase()) > -1 && obj.MapId === $scope.selMapId);
                                }
                            }

                            if (aisle) {
                                aislenumber.push(aisle.Id);
                                aisleDesc.push(aisle.Description);
                            }
                        });

                        item["AisleNumber"] = aislenumber;
                        item["AisleDescription"] = aisleDesc.join(",");
                    });
                    console.log($scope.listImport);
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
                    $scope.savingFlag = true;
                    angular.forEach($scope.listImport, function (value, key) {
                        if (value.isChecked || type === 1) {
                            var newObj = JSON.parse(JSON.stringify(value));
                            delete newObj["isChecked"];
                            delete newObj["$$hashKey"];
                            delete newObj["SheetNumber"];
                            newObj["StoreId"] = $scope.store.StoreId;
                            importList.push(newObj);
                        }
                    });

                    importSelectedProduct(importList, 0, ev);
                }
            });
    }

    importSelectedProduct = function (importList, num, ev) {
        var start = num;
        var end = start + 100; //get 100
        if (start < importList.length) {
            var newList = importList.slice(start, end);
            $http({
                method: "POST",
                url: "/api/import/products",
                data: {
                    userid: $scope.global.currentUser.id,
                    listProduct: newList
                }
            }).then(function successCallback(res) {
                if (res.data.data.success) {
                    importSelectedProduct(importList, end);
                }
            }, function errorCallback(err) {
                console.log(err);
                $scope.savingFlag = false;
            });
        } else {
            dialogSvc.showAlert("Information", "Successfully imported.", "Ok", true, "parent", ev)
                .then(function () {
                    $mdDialog.hide(true);
                });
            $scope.savingFlag = false;
        }
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