mainApp.controller("dashboardCtrl", function ($scope, $timeout, $http, $state) {

    // variable declaration
    $scope.getListFlag = false;
    $scope.filterObj = $state.params.isfav ? { IsFavorite: 1 } : {};

    // when controller activates
    function activate() {
        setTimeout(function () {
            $.AdminLTE.layout.fix();
        }, 150);

        $scope.global.listStore = [];
        $scope.global.listFavorite = [];
        $scope.currentList = [];
        $scope.getStore(0);

    }

    // this will set the isfavorite field on database
    $scope.updateFavorite = function (item) {
        var origValue = item.IsFavorite;
        item.IsFavorite = !item.IsFavorite;
        $http({
            method: "PUT",
            url: "/api/store/updateFavorite",
            data: {
                id: item.Id,
                isfavorite: item.IsFavorite
            }
        }).then(function (result) {
            if (!result.data.success) {
                item.IsFavorite = origValue;
            }
        }, function (error) {
            console.log(error);
        });
    }

    // get stores with limits
    $scope.getStore = function (idx) {
        $scope.getListFlag = true;
        $http({
            method: "GET",
            url: "/api/store/getlimit",
            params: {
                start: idx,
                count: 12,
                userid: $scope.global.currentUser.id,
                isfavorite: $state.params.isfav
            },
            cache: false
        }).then(function (res) {
            if (res.data.success) {
                $scope.currentList = $scope.currentList.concat(res.data.rows);
                $scope.global.listStore = $state.params.isfav ? $scope.global.listStore : $scope.global.listStore.concat(res.data.rows);
                $scope.global.listFavorite = $state.params.isfav ? res.data.rows : $scope.global.listFavorite;
            }
            $scope.getListFlag = false;
        }, function (err) {
            console.log(err);
        });
    }

    // when scroll reach bottom it will call another getStore api
    $(".dashboard").bind('scroll', (e) => {
        var elem = $(e.currentTarget);
        if (elem[0].scrollHeight - elem.scrollTop() <= (elem.outerHeight() + (elem.outerHeight() / 3))) {
            if (!$scope.getListFlag) {
                $scope.getStore($scope.currentList.length);
            }
        }
    });

    // return store default image
    $scope.getImage = function(item) {
        return "/assets/images/stores/" + item.StoreId + "/" + item.DefaultImage;
    }

    activate();
});