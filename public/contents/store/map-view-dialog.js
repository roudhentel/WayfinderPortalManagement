mainApp.controller("mapViewDialogCtrl", function ($scope, $http, Dialog) {
    $scope.selMap = $scope.selectedMap;
    var s = {};
    var dialogSvc = new Dialog();
    var movingBall = undefined;
    var lineDirection = undefined;
    $scope.disableButton = false;
    $scope.selectedRoute = undefined;

    // set product aisle's route(s)

    $scope.changeMap = function (mapId) {
        if ($scope.image) $scope.image.remove();

        // get aisle routes
        $scope.productAisleRoutes = $scope.listAisleRoute.filter(obj => $scope.selectedProduct.AisleNumber.indexOf(obj.AisleId.toString()) > -1 &&
            obj.MapId === mapId);

        var selMap = $scope.listMaps.find(obj => obj.Id === mapId);

        if (selMap) {
            s.selectAll("circle").remove();
            s.selectAll("polyline").remove();
            s.attr({
                "viewBox": "0 0 " + selMap.Width + " " + selMap.Height
            });

            $scope.image = s.image("/assets/maps/" + $scope.store.StoreId + "/" + selMap.Filename, 0, 0, 100, 100).attr({
                width: "100%",
                height: "100%"
            });
        }
    }

    $scope.getProductRoutes = function () {
        $http({
            method: "GET",
            url: "/api/product/getProductRoutes",
            params: {
                productid: $scope.selectedProduct.Id
            }
        }).then(function (response) {
            if (response.data.success) {
                $scope.listRoutes = response.data.rows;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.addRoute = function (ev) {
        $scope.newHeader = "Add Route";
        dialogSvc.showDialog("addRouteCtrl", $scope, "/contents/store/add-route.html", false, "parent", ev)
            .then(function (response) {
                if (response) {
                    //console.log(response);
                    //$scope.getProductRoutes();
                    $scope.listRoutes.push(response);
                }
            });
    }

    $scope.editRoute = function (ev, route) {
        if (!route || !route.ProductId) return;
        $scope.newHeader = "Edit Route";
        $scope.selectedRoute = route;
        var idx = $scope.listRoutes.indexOf(route);

        dialogSvc.showDialog("addRouteCtrl", $scope, "/contents/store/add-route.html", false, "parent", ev)
            .then(function (response) {
                if (response) {
                    //$scope.getProductRoutes();
                    $scope.listRoutes[idx] = response;
                }

            });
    }

    $scope.viewOnMap = function (route) {
        if (!route) return;

        // remove all circles first
        s.selectAll("circle").remove();

        // parse array
        var directions = [];
        var dir = route.Coordinates.split(",")
        var ctr = 1;
        for (let x = 1; x < dir.length; x += 2) {
            directions.push({
                x: dir[x - 1],
                y: dir[x]
            });
        }

        if (movingBall) movingBall.remove();
        movingBall = s.circle(directions[0].x, directions[0].y, 20);
        movingBall.attr({
            fill: '#f00',
            stroke: '#000',
            strokeWidth: 1
        });
        s.circle(directions[0].x, directions[0].y, 20).attr({ "fill": "green" });

        if (lineDirection) lineDirection.remove();
        lineDirection = s.polyline().attr({
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

    setTimeout(() => {
        s = Snap("#svg_map");
        $scope.changeMap($scope.selMap);
    }, 100);

    $scope.getProductRoutes();
});