mainApp.factory("LoginService", function ($http) {
    function LoginService() {

    }

    LoginService.prototype = {
        authenticate: function (loginInfo, callback) {
            $http({
                method: "POST",
                url: "/api/user/authenticate",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    email: loginInfo.email,
                    password: loginInfo.password
                }
            }).then(function successCallback(res) {
                callback(res, undefined);
            }, function errorCallback(err) {
                callback(undefined, err);
            });
        }
    }

    return LoginService;
});