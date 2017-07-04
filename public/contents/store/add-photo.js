mainApp.controller("addPhotoCtrl", function ($scope, $http, Dialog) {
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
                    var filename = ($scope.listPhotos.length + 1) + ".jpg";
                    $('#uploadForm input[type="file"]').each(function () {
                        $.each(this.files, function (i, file) {
                            data.append('myPhoto', file);
                        });
                    });

                    $.ajax({
                        url: "/api/import/photo?filename=" + filename + "&storeid=" + $scope.store.StoreId,
                        type: "POST",
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            if (res.success) {
                                dialogSvc.showAlert("Information", "Successfully uploaded.", "Ok", true, "parent", ev);
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