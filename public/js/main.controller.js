mainApp.controller("indexCtrl", function ($scope, $state, $mdDialog) {
    $scope.getCurrentState = function () {
        var _ret = "";
        if ($state.current.name === "main" ||
            $state.current.name === "main.login" ||
            $state.current.name === "main.register") {
            return "login-page"
        } else {
            return "sidebar-mini"
        }
    }

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    $scope.global = {
        listStore: [],
        currentUser: { id: 1 },
        listFavorite: []
    }
});