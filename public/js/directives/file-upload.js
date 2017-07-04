mainApp.directive('fileUpload', function ($http, $filter, $parse) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            fileName: '='
        },
        link: function (scope, element, attrs) {
            scope.fileName = '';
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.on('change', function (evt) {
                scope.$apply(function () {
                    var files = evt.target.files;

                    var listFileNames = '';
                    angular.forEach(files, function (value, key) {
                        listFileNames = listFileNames + value.name + "/";
                    });
                    scope.fileName = $filter('cut')(listFileNames);
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

mainApp.filter('cut', function () {
    return function (value) {
        if (!value) return '';
        value = value.substr(0, value.length - 1);
        return value;
    };
});