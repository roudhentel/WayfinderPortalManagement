mainApp.controller("storeDataCtrl", function ($scope, $mdMenu, $http, $interval, Dialog) {
    var dialogSvc = new Dialog();
    var movingBall = undefined;
    var lineDirection = undefined;

    $scope.rebuildTable();

    $scope.getPhoto = function (photo) {
        return "/assets/images/stores/" + $scope.store.StoreId + "/" + photo;
    }

    var timer = $interval(() => {
        if ($scope.getMapAisleFlag === false) {
            $scope.redrawAisle();
            $interval.cancel(timer);
        }
    }, 1000);

    $scope.showAddAisleDialog = function (ev) {
        $scope.newHeader = "Add Aisle";
        dialogSvc.showDialog("addAisleCtrl", $scope, "/contents/store.data/add-aisle.html", false, "parent", ev)
            .then(function (res) {
                if (res) {
                    $scope.listAisle.push(res);
                    $scope.redrawAisle();
                }
            });
    }

    $scope.showEditAisleDialog = function (ev) {
        $scope.newHeader = "Edit Aisle";
        dialogSvc.showDialog("addAisleCtrl", $scope, "/contents/store.data/add-aisle.html", false, "parent", ev)
            .then(function (res) {
                if (res) {
                    var aisle = $scope.listAisle.find(obj => obj.Id === res.Id);
                    var idx = $scope.listAisle.indexOf(aisle);
                    $scope.listAisle[idx] = res;
                    $scope.redrawAisle();
                }
            });
    }

    $scope.deleteAisle = function (ev) {
        if ($scope.aisleProducts.length > 0) {
            dialogSvc.showAlert("Information", "Cannot delete aisle with product(s)", "Ok", true, "parent", ev);
            return;
        }

        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete " + $scope.selectedAisle.Description, "Yes", "No", false, "parent", ev)
            .then(function (res) {
                if (res) {
                    $http({
                        method: "DELETE",
                        url: "/api/aisle/delete",
                        params: {
                            id: $scope.selectedAisle.Id
                        }
                    }).then(function (response) {
                        if (response.data.success) {
                            dialogSvc.showAlert("Information", "Aisle successfully deleted", "Ok", true, "parent", ev).then(function () {
                                var idx = $scope.listAisle.indexOf($scope.selectedAisle);
                                if (idx > -1) {
                                    $scope.listAisle.splice(idx, 1);
                                    $scope.redrawAisle();
                                }
                            })
                        }
                    }, function (error) {
                        console.log(error);
                    })
                }
            })
    }

    $scope.hideContextMenu = function () {
        $('.context-menu').css("display", "none");
    }

    $scope.addRoute = function (ev) {
        $scope.newHeader = "Add Aisle's Route";
        dialogSvc.showDialog("addRouteCtrl", $scope, "/contents/store/add-route.html", false, "parent", ev)
            .then(function (route) {
                if (route) {
                    $scope.listAisleRoute.push(route);
                }
            });
    }

    $scope.editRoute = function (ev, routeId) {
        if (routeId) {
            $scope.selectedRoute = $scope.listAisleRoute.find(obj => obj.Id === routeId);
            $scope.newHeader = "Edit Aisle's Route";
            dialogSvc.showDialog("addRouteCtrl", $scope, "/contents/store/add-route.html", false, "parent", ev)
                .then(function (coor) {
                    if (coor) {
                        var idx = $scope.listAisleRoute.indexOf($scope.selectedRoute);
                        $scope.listAisleRoute[idx].Coordinates = coor;
                    }
                });
        }
    }

    $scope.viewOnMap = function (routeId) {
        if (!routeId) return;

        // remove all circles first
        $scope.svg.selectAll("circle").remove();

        // parse array
        var directions = [];
        var selectedroute = $scope.listAisleRoute.find(obj => obj.Id === routeId);
        var dir = selectedroute.Coordinates.split(",")
        var ctr = 1;
        for (let x = 1; x < dir.length; x += 2) {
            directions.push({
                x: dir[x - 1],
                y: dir[x]
            });
        }

        if (movingBall) movingBall.remove();
        movingBall = $scope.svg.circle(directions[0].x, directions[0].y, 15);
        movingBall.attr({
            fill: '#f00',
            stroke: '#000',
            strokeWidth: 1
        });
        $scope.svg.circle(directions[0].x, directions[0].y, 15).attr({ "fill": "green" });

        if (lineDirection) lineDirection.remove();
        lineDirection = $scope.svg.polyline().attr({
            points: directions[0].x + "," + directions[0].y,
            fill: "none",
            stroke: "black",
            strokeWidth: 10,
            strokeDasharray: "10",
            strokeDashoffset: 50,
            strokeLinejoin: "round"
        });

        $scope.disableButton = true;
        moveBall(directions, 1);
    }

    var moveBall = function (directions, idx) {
        // get distance beetween points
        var a = directions[idx - 1].x - directions[idx].x;
        var b = directions[idx - 1].y - directions[idx].y;
        var distance = Math.sqrt(a * a + b * b);
        // calculate speed for transition
        var speed = (distance / 120) * 250;

        movingBall.animate({
            cx: directions[idx].x,
            cy: directions[idx].y
        }, speed, function () {
            if ((idx + 1) < directions.length) {
                //s.circle(directions[idx].x, directions[idx].y, 15).attr({ "fill": "blue" });
                moveBall(directions, ++idx);
            } else {
                $scope.disableButton = false;
                $scope.$digest();
            }
        });
        var from = [parseInt(directions[idx - 1].x), parseInt(directions[idx - 1].y)];
        var to = [parseInt(directions[idx].x), parseInt(directions[idx].y)];
        Snap.animate(from, to, function (value) {
            lineDirection.attr({
                points: lineDirection.node.attributes["points"].value + "," + value[0] + "," + value[1]
            });
        }, speed);

    }

    $scope.getStoreAisle = function (aisleNos) {
        var desc = "";

        aisleNos.forEach(item => {
            var a = $scope.listAisle.filter(aisle => aisle.MapId === $scope.selMapId).find(aisle => aisle.Id === parseInt(item));
            desc += a ? (a.Description + ", ") : "";
        });

        return desc.length > 0 ? desc.substring(0, desc.length - 2) : desc;
    }

    $scope.deleteMap = function (e) {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete this map?", "Yes", "No", false, "parent", e).then(function (res) {
            if (res) {
                $http({
                    method: "DELETE",
                    url: "/api/map/delete",
                    params: {
                        id: $scope.selMapId
                    }
                }).then(function (res) {
                    if (res.data.success) {
                        var map = $scope.listMaps.find(obj => obj.Id === $scope.selMapId);
                        var idx = $scope.listMaps.indexOf(map);
                        if (idx > -1) {
                            $scope.listMaps.splice(idx, 1);
                        }
                    }
                }, function (err) {
                    console.log(err);
                });
            }
        });
    }

    $scope.showCopyAisles = function (ev) {
        dialogSvc.showDialog("copyAislesCtrl", $scope, "/contents/store.data/copy-aisles.html", false, "parent", ev).then(function (res) {
            if (res) {
                $scope.listAisle.push.apply($scope.listAisle, res);
                $scope.redrawAisle();
            }
        });
    }

});