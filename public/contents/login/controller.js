mainApp.controller("loginCtrl", function ($scope, $state, LoginService) {
    // variable declaration
    $scope.txtUsername = { value: "", enable: true };
    $scope.txtPassword = { value: "", enable: true };
    $scope.btnLogin = { value: "LOGIN", enable: true };
    $scope.loginFlag = false;
    $scope.isCredentialValid = true;
    var loginSvc = new LoginService();

    $scope.login = function (isFormValid) {
        if (!isFormValid) return;

        $scope.isCredentialValid = true;
        $scope.loginFlag = true;
        enableElements(false);
        
        loginSvc.authenticate({
            email: $scope.txtUsername.value,
            password: $scope.txtPassword.value
        }, function (result, error) {
            if (!error) {
                if (result.data.success) {
                    $scope.global.currentUser = {
                        id: result.data.user.Id,
                        fullname: result.data.user.Fullname,
                        email: result.data.user.Email
                    };
                    $state.go("home.dashboard");
                } else {
                    $scope.isCredentialValid = false;
                }
            } else {
                console.log(error);
            }
            enableElements(true);
            $scope.loginFlag = false;
        });
    }

    var enableElements = function (_bool) {
        $scope.txtUsername.enable = _bool;
        $scope.txtPassword.enable = _bool;
        $scope.btnLogin.enable = _bool;
    }
});