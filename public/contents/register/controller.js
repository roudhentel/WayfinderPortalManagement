mainApp.controller("registerCtrl", function ($scope, $http, Dialog, $state) {

    var dialogSvc = new Dialog();

    $scope.user = {
        Fullname: "",
        Password: "",
        RePassword: "",
        Email: "",
        IsAgree: false
    };

    $scope.savingFlag = false;

    $scope.register = function (IsFormValid, ev) {
        if (!IsFormValid) return;

        if ($scope.user.Password !== $scope.user.RePassword) {
            dialogSvc.showAlert("Information", "Password did not match", "Ok", true, "parent", ev);
            return;
        }

        $scope.savingFlag = true;
        $http({
            url: "/api/user/add",
            method: "POST",
            data: $scope.user
        }).then(function (response) {
            if (response.data.success) {
                dialogSvc.showAlert("Information", "New account created.", "Ok", true, "parent", ev)
                .then(function(){
                    $state.go("main.login");
                });
            } else {
                if (response.data.isuserexist) {
                    dialogSvc.showAlert("Information", "Email already exist.", "Ok", true, "parent", ev);
                }
            }
            $scope.savingFlag = false;
        }, function (error) {
            console.log(error);
            $scope.savingFlag = false;
        });
    }
});