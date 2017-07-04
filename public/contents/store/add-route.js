mainApp.controller("addRouteCtrl", function ($scope, $http, $mdDialog, Dialog) {
    var svg = {};
    var dialogSvc = new Dialog();
    var polyline = undefined;
    $scope.svgMap = undefined;
    var listPoints = [];
    var tempx = 0;
    var tempy = 0;

    $scope.header = $scope.newHeader;

    setTimeout(() => {
        svg = Snap("#svg");
        changeMap($scope.selMapId);
        $scope.clearDirection();

        // draw the aisle
        if ($scope.header.toLowerCase().indexOf('aisle') > -1) {
            if ($scope.selectedAisle.Type.toString() === "3") {
                // polygon
                svg.polygon().attr({ 'fill': 'green', 'points': $scope.selectedAisle.Points });

            } else {
                // rect and oval
                svg.rect($scope.selectedAisle.X, $scope.selectedAisle.Y,
                    $scope.selectedAisle.Width, $scope.selectedAisle.Height,
                    $scope.selectedAisle.Rx, $scope.selectedAisle.Ry).attr({ 'fill': 'green' });

            }
        }

        // draw the line with no points
        polyline = svg.polyline().attr({
            fill: "none",
            stroke: "black",
            strokeWidth: 10,
            strokeDasharray: "10",
            strokeDashoffset: 50,
            strokeLinejoin: "round"
        });

        if ($scope.header.toLowerCase().indexOf('edit') > -1) {
            // edit
            $scope.addPointsAndLines();
        }

        svg.dblclick(function (e) {
            var fillColor = listPoints.length === 0 ? "green" : "blue";
            listPoints.push(svg.circle(e.offsetX, e.offsetY, 10).attr({ "fill": fillColor })
                .drag(function (dx, dy, posx, posy) {
                    // move
                    this.attr({
                        cx: tempx + dx,
                        cy: tempy + dy
                    });

                    //update the line
                    var points = "";
                    listPoints.forEach(obj => {
                        points += obj.node.attributes["cx"].value + "," + obj.node.attributes["cy"].value + ",";
                    });
                    points = points.substring(0, (points.length - 1));
                    polyline.attr({ "points": points });

                    //console.log(this);
                }, function (ev) {
                    // start
                    tempx = parseInt(this.node.attributes["cx"].value);
                    tempy = parseInt(this.node.attributes["cy"].value);
                }, function (ev) {
                    // end
                }));

            // update circle fill color
            for (let x = 1; x < listPoints.length; x++) {
                var fc = x === listPoints.length - 1 ? "red" : "blue";
                listPoints[x].attr({ "fill": fc });
            }

            if (polyline.node.attributes["points"]) {

                lineObj = {
                    points: polyline.node.attributes["points"].value + "," + e.offsetX + "," + e.offsetY
                }
            } else {
                lineObj = {
                    points: e.offsetX + "," + e.offsetY
                }
            }

            polyline.attr(lineObj);
        });

    }, 100);

    $scope.addPointsAndLines = function () {
        polyline.attr({
            points: $scope.selectedRoute.Coordinates
        });

        var directions = [];
        var dir = $scope.selectedRoute.Coordinates.split(",")
        var ctr = 1;
        for (let x = 1; x < dir.length; x += 2) {
            directions.push({
                x: dir[x - 1],
                y: dir[x]
            });
        }

        listPoints.length = 0;
        directions.forEach((obj, idx) => {
            var fillColor = idx === 0 ? "green" : idx < (directions.length - 1) ? "blue" : "red";
            listPoints.push(svg.circle(obj.x, obj.y, 10).attr({ "fill": fillColor })
                .drag(function (dx, dy, posx, posy) {
                    // move
                    this.attr({
                        cx: tempx + dx,
                        cy: tempy + dy
                    });

                    //update the line
                    var points = "";
                    listPoints.forEach(obj => {
                        points += obj.node.attributes["cx"].value + "," + obj.node.attributes["cy"].value + ",";
                    });
                    points = points.substring(0, (points.length - 1));
                    polyline.attr({ "points": points });

                    //console.log(this);
                }, function (ev) {
                    // start
                    tempx = parseInt(this.node.attributes["cx"].value);
                    tempy = parseInt(this.node.attributes["cy"].value);
                }, function (ev) {
                    // end
                }));
        })
    }

    $scope.clearDirection = function () {
        svg.selectAll("circle").remove();

        if (polyline) polyline.remove();

        listPoints = [];
    }

    $scope.addRoute = function (ev) {
        if (!polyline.node.attributes["points"]) {
            return;
        }
        if ($scope.header.toLowerCase().indexOf('aisle') > -1) {
            if ($scope.header.toLowerCase().indexOf('add') > -1) {
                // add aisle's route
                $http({
                    method: "POST",
                    url: "/api/aisle/addRoute",
                    data: {
                        MapId: $scope.selMapId,
                        AisleId: $scope.selectedAisle.Id,
                        Coordinates: polyline.node.attributes["points"].value
                    }
                }).then(function (response) {
                    if (response.data.success) {
                        dialogSvc.showAlert("Information", "Route successfully added.", "Ok", true, "parent", ev).then(function (res) {
                            $mdDialog.hide(response.data.row);
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
            } else {
                // edit aisle's route
                $http({
                    method: "PUT",
                    url: "/api/aisle/editRoute",
                    data: {
                        Id: $scope.selectedRoute.Id,
                        Coordinates: polyline.node.attributes["points"].value
                    }
                }).then(function (response) {
                    if (response.data.success) {
                        dialogSvc.showAlert("Information", "Route successfully updated.", "Ok", true, "parent", ev).then(function (res) {
                            $mdDialog.hide(polyline.node.attributes["points"].value);
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        } else {
            if ($scope.header.toLowerCase().indexOf('add') > -1) {
                $http({
                    method: "POST",
                    url: "/api/map/addMapRoute",
                    data: {
                        mapid: $scope.selMapId,
                        productid: $scope.selectedProduct.Id,
                        coordinates: polyline.node.attributes["points"].value
                    }
                }).then(function (response) {
                    if (response.data.success) {
                        dialogSvc.showAlert("Information", "Route successfully added.", "Ok", true, "parent", ev).then(function (res) {
                            $mdDialog.hide(response.data.row);
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
            } else {
                $http({
                    method: "PUT",
                    url: "/api/map/editRoute",
                    data: {
                        id: $scope.selectedRoute.Id,
                        coordinates: polyline.node.attributes["points"].value
                    }
                }).then(function (response) {
                    if (response.data.success) {
                        dialogSvc.showAlert("Information", "Route successfully edited.", "Ok", true, "parent", ev)
                            .then(function (res) {
                                $scope.selectedRoute.Coordinates = polyline.node.attributes["points"].value;
                                $mdDialog.hide($scope.selectedRoute);
                            });
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }


    }

    var changeMap = function (mapId) {
        if ($scope.svgMap) $scope.svgMap.remove();

        var selMap = $scope.listMaps.find(obj => obj.Id === mapId);

        if (selMap) {
            svg.attr({
                "viewBox": "0 0 " + selMap.Width + " " + selMap.Height
            });

            $scope.svgMap = svg.image("/assets/maps/" + $scope.store.StoreId + "/" + selMap.Filename, 0, 0, 100, 100).attr({
                width: selMap.Width + "px",
                height: selMap.Height + "px"
            });

            $(".map-container-add-route").width(selMap.Width);
            $(".map-container-add-route").height(selMap.Height);
        }
    }

});