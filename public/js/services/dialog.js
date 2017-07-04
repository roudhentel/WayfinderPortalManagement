mainApp.factory("Dialog", function ($mdDialog) {
    function Dialog() {

    }

    Dialog.prototype = {
        showAlert: function (title, content, btnLabel, clickOutsideToClose, parent, ev) {
            return $mdDialog.show(
                $mdDialog.alert({ skipHide: true })
                    .parent(angular.element(document.querySelector('#' + parent)))
                    .clickOutsideToClose(clickOutsideToClose)
                    .title(title)
                    .textContent(content)
                    .ariaLabel('Alert Dialog')
                    .ok(btnLabel)
                    .targetEvent(ev)
            );
        },
        showConfirm: function (title, content, btnOk, btnCancel, clickOutsideToClose, parent, ev) {
            return $mdDialog.show(
                $mdDialog.confirm({ skipHide: true })
                    .title(title)
                    .textContent(content)
                    .ariaLabel('Confirm Dialog')
                    .ok(btnOk)
                    .cancel(btnCancel)
                    .clickOutsideToClose(clickOutsideToClose)
                    .parent(angular.element(document.querySelector('#' + parent)))
                    .targetEvent(ev)
            ).then(function () {
                return true;
            }, function () {
                return false;
            });
        },
        showPrompt: function (title, content, placeholder, btnOk, btnCancel, clickOutsideToClose, parent, ev) {
            return $mdDialog.show(
                $mdDialog.prompt()
                    .title(title)
                    .textContent(content)
                    .placeholder(placeholder)
                    .ariaLabel('Prompt Dialog')
                    .ok(btnOk)
                    .cancel(btnCancel)
                    .clickOutsideToClose(clickOutsideToClose)
                    .parent(angular.element(document.querySelector('#' + parent)))
                    .targetEvent(ev)
            ).then(function (result) {
                return result;
            }, function () {
                return false;
            });
        },
        showDialog: function (controller, scope, templateUrl, clickOutsideToClose, parent, ev) {
            return $mdDialog.show({
                controller: controller,
                scope: scope.$new(),
                templateUrl: templateUrl,
                ariaLabel: 'Dialog',
                parent: angular.element(document.querySelector('#' + parent)),
                targetEvent: ev,
                clickOutsideToClose: clickOutsideToClose,
                skipHide: true
            }).then(function (result) {
                return result;
            }, function () {
                return false;
            });
        }
    }

    return Dialog;
});