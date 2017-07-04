mainApp.controller("addMapCtrl", function ($scope, $http, $mdDialog, Dialog) {
    var dialogSvc = new Dialog();

    $scope.upload = function (ev) {
        if ($("#fileInput").get(0).files.length === 0) {
            dialogSvc.showAlert("Information", "Select file first.", "Ok", true, "parent", ev);
            return;
        }
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to upload selected file?", "Yes", "No", false, "parent", ev)
            .then(function (response) {
                if (response) {
                    var data = new FormData();
                    $('#uploadForm input[type="file"]').each(function () {
                        $.each(this.files, function (i, file) {
                            data.append('myMap', file);
                        });
                    });

                    $.ajax({
                        url: "/api/import/map?storeid=" + $scope.store.StoreId,
                        type: "POST",
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            if (res.success) {
                                dialogSvc.showAlert("Information", "Successfully uploaded.", "Ok", true, "parent", ev).then(function (result) {
                                    $mdDialog.hide(res.row);
                                });
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
            });
    }
});