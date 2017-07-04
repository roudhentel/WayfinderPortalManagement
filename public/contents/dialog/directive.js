mainApp.directive("dialogTemplate", function ($mdDialog) {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            addClass: '@'
        },
        transclude: true,
        templateUrl: 'contents/dialog/',
        controller: function($scope) {
            $scope.closeDialog = function(){
                $mdDialog.hide();
            }
        }
    }
});