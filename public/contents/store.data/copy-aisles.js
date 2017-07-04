mainApp.controller("copyAislesCtrl", function ($scope, $http, $mdDialog, $httpParamSerializerJQLike, Dialog) {
    let s = $scope;
    let dialogSvc = new Dialog();

    s.dialogObj = {
        selectedMap: 0,
        savingFlag: false
    };

    s.listMapModified = s.listMaps.filter(obj => obj.Id !== s.selMapId);

    s.copyAisles = (ev) => {
        s.dialogObj.savingFlag = true;
        $http({
            method: "POST",
            url: "/api/aisle/copy",
            data: {
                fromMapId: s.dialogObj.selectedMap,
                toMapId: s.selMapId
            }
        }).then(function (res) {
            if (res.data.success) {
                dialogSvc.showAlert("Information", "Successfully copied", "Ok", true, "parent", ev).then(function () {
                    s.getStoreAisleRoutes();
                    $mdDialog.hide(res.data.rows);
                });
            }
            s.dialogObj.savingFlag = false;
        }, function (err) {
            console.log(err);
            s.dialogObj.savingFlag = false;
        });
    };
});