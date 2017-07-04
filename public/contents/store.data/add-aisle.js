mainApp.controller("addAisleCtrl", function ($scope, $http, $mdDialog, Dialog) {

    $scope.header = $scope.newHeader;
    var dialogSvc = new Dialog(),
        svgAisle = {},
        svgMap = undefined,
        tempx = 0,
        tempy = 0,
        objAisle = undefined,
        polygon = undefined,
        listPoints = [],
        circ = undefined,
        isEdit = $scope.header.toLowerCase().indexOf("edit") > -1

    $scope.aisle = isEdit ? JSON.parse(JSON.stringify($scope.selectedAisle)) :
        {
            Id: 0,
            MapId: $scope.selMapId,
            Description: "",
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0,
            Rx: 0,
            Ry: 0,
            Points: "",
            Type: 2
        }

    $scope.selectedObject = $scope.aisle.Type.toString();
    var doubleClickEnable = $scope.aisle.Type.toString() === "3";
    $scope.dragEnabled = !doubleClickEnable;

    setTimeout(() => {
        svgAisle = Snap("#svg-aisle");
        changeMap($scope.selMapId);

        // drag event when selectedObject is 1: Circle or 2: Rectangle
        svgAisle.drag(function (dx, dy, posx, posy) {
            if ($scope.dragEnabled) {
                var newx = tempx + dx;
                var newy = tempy + dy;
                var w = Math.abs(tempx - newx);
                var h = Math.abs(tempy - newy);
                objAisle.attr({
                    'width': w,
                    'height': h,
                    'rx': $scope.aisle.Type === "1" ? w : 0,
                    'ry': $scope.aisle.Type === "1" ? h : 0
                });
            }
        }, function (x, y, ev) {
            if ($scope.dragEnabled) {
                if (objAisle) objAisle.remove(); // remove if object exist

                tempx = ev.offsetX;
                tempy = ev.offsetY;

                objAisle = svgAisle.rect(tempx, tempy, 0, 0, 0, 0).attr({ 'stroke': 'black', 'fill': 'blue' });
            }

        }, function (ev) {
            // console.log("drag end");
        });

        // double click event
        svgAisle.dblclick(function (e) {
            if (doubleClickEnable) {
                polygon = polygon === undefined ? svgAisle.polygon().attr({
                    fill: "blue",
                    stroke: "black",
                    strokeWidth: 2,
                    strokeDasharray: "2",
                    strokeDashoffset: 2,
                    strokeLinejoin: "round"
                }) : polygon;
                if (polygon && polygon.node.attributes["points"] &&
                    polygon.node.attributes["points"].value !== "" && listPoints.length === 0) {
                    polygon.attr({ 'points': '' });
                }
                var fillColor = listPoints.length === 0 ? "green" : "blue";
                listPoints.push(svgAisle.circle(e.offsetX, e.offsetY, 5).attr({ "fill": fillColor })
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
                        polygon.attr({ "points": points });

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

                if (polygon.node.attributes["points"]) {

                    lineObj = {
                        points: polygon.node.attributes["points"].value + "," + e.offsetX + "," + e.offsetY
                    }
                } else {
                    lineObj = {
                        points: e.offsetX + "," + e.offsetY
                    }
                }

                polygon.attr(lineObj);
            }
        });

        // load existing aisle
        var filteredAisle = $scope.listAisle.filter(obj => obj.MapId === $scope.selMapId);
        for (let i = 0; i < filteredAisle.length; i++) {
            var aisle = filteredAisle[i];
            if (aisle.Type.toString() === "3") {
                // polygon
                if (aisle.Id !== $scope.aisle.Id) {
                    svgAisle.polygon().attr({ 'fill': 'green', 'points': aisle.Points });
                } else {
                    polygon = svgAisle.polygon().attr({
                        'fill': 'blue',
                        'points': aisle.Points,
                        'stroke': 'black',
                        'strokeWidth': 2,
                        'strokeDasharray': "2",
                        'strokeDashoffset': 2,
                        'strokeLinejoin': "round"
                    });
                }
            } else {
                // rect and oval
                if (aisle.Id !== $scope.aisle.Id) {
                    svgAisle.rect(aisle.X, aisle.Y, aisle.Width, aisle.Height, aisle.Rx, aisle.Ry).attr({ 'fill': 'green' });
                } else {
                    objAisle = svgAisle.rect(aisle.X, aisle.Y, aisle.Width, aisle.Height, aisle.Rx, aisle.Ry).attr({ 'fill': 'blue' });
                }

            }
        }
    });

    $scope.changeSelectedType = function (type) {
        if (type) {
            $scope.dragEnabled = type === "1" || type === "2";
            if ((type.toString() === "1" || type.toString() === "2") &&
                ($scope.aisle.Type.toString() === "1" || $scope.aisle.Type.toString() === "2")) {
                if (objAisle) {
                    objAisle.attr({
                        'rx': type === "1" ? objAisle.node.attributes["width"].value : 0,
                        'ry': type === "1" ? objAisle.node.attributes["height"].value : 0
                    });
                }
            }

            if (type.toString() === "3") {
                doubleClickEnable = true;
                $scope.dragEnabled = false;
                if (objAisle) objAisle.remove();
            } else {
                $scope.dragEnabled = true;
                doubleClickEnable = false;
                if (polygon) {
                    polygon.remove();
                    polygon = undefined;
                }
            }
            $scope.aisle.Type = type ? type : $scope.aisle.Type;

        }
    }

    var changeMap = function (mapId) {
        if (svgMap) svgMap.remove();

        var selMap = $scope.listMaps.find(obj => obj.Id === mapId);

        if (selMap) {
            svgAisle.attr({
                "viewBox": "0 0 " + selMap.Width + " " + selMap.Height
            });

            svgMap = svgAisle.image("/assets/maps/" + $scope.store.StoreId + "/" + selMap.Filename, 0, 0, 100, 100).attr({
                width: selMap.Width + "px",
                height: selMap.Height + "px"
            });

            $(".map-container-dialog").width(selMap.Width);
            $(".map-container-dialog").height(selMap.Height);
        }
    }

    $scope.addAisle = function (isFormValid, ev) {
        if (!isFormValid) return;
        var isValid = true;

        // check if there is intersection from existing list
        // for (let i = 0; i < $scope.listAisle.length; i++) {
        //     var aisle = $scope.listAisle[i];
        //     var poly1 = new Polygon({ "x": 0, "y": 0 }, "#ffffff");
        //     poly1.addAbsolutePoint({ "x": aisle.X, "y": aisle.Y }); // set the first point
        //     poly1.addAbsolutePoint({ "x": aisle.X + aisle.Width, "y": aisle.Y }); // second point
        //     poly1.addAbsolutePoint({ "x": aisle.X, "y": aisle.Y + aisle.Height }); // third point
        //     poly1.addAbsolutePoint({ "x": aisle.X + aisle.Width, "y": aisle.Y + aisle.Height }); // forth point


        //     var newPoly = undefined;
        //     if ($scope.aisle.Type.toString() === "3") {
        //         var points = polygon.node.attributes["points"].value;
        //         var arr = points.split(",");
        //         for (let o = 1; o < arr.length; o += 2) {
        //             if (o === 1) {
        //                 newPoly = new Polygon({ "x": 0, "y": 0 }, "#ffffff");
        //             }
        //             newPoly.addAbsolutePoint({ "x": arr[o - 1], "y": arr[o] });
        //         }
        //     } else {
        //         var x = parseInt(objAisle.node.attributes["x"].value);
        //         var y = parseInt(objAisle.node.attributes["y"].value);
        //         var w = parseInt(objAisle.node.attributes["width"].value);
        //         var h = parseInt(objAisle.node.attributes["height"].value);

        //         newPoly = new Polygon({ "x": 0, "y": 0 }, "#ffffff");
        //         newPoly.addAbsolutePoint({ "x": x, "y": y });
        //         newPoly.addAbsolutePoint({ "x": x + w, "y": y });
        //         newPoly.addAbsolutePoint({ "x": x, "y": y + h });
        //         newPoly.addAbsolutePoint({ "x": x + w, "y": y + h });
        //     }


        //     // if (x < aisle.X + aisle.Width && x + w > aisle.X && y < aisle.Y + aisle.Height && y + h > aisle.Y) {
        //     //     isValid = false;
        //     //     break;
        //     // }

        //     if (newPoly.intersectsWith(poly1)) {
        //         isValid = false;
        //         break;
        //     }
        // }

        if (!isValid) return;

        $scope.aisle.X = $scope.aisle.Type.toString() === "3" ? "0" : objAisle.node.attributes["x"].value;
        $scope.aisle.Y = $scope.aisle.Type.toString() === "3" ? "0" : objAisle.node.attributes["y"].value;
        $scope.aisle.Width = $scope.aisle.Type.toString() === "3" ? "0" : objAisle.node.attributes["width"].value;
        $scope.aisle.Height = $scope.aisle.Type.toString() === "3" ? "0" : objAisle.node.attributes["height"].value;
        $scope.aisle.Rx = $scope.aisle.Type.toString() === "1" ? objAisle.node.attributes["width"].value : "0";
        $scope.aisle.Ry = $scope.aisle.Type.toString() === "1" ? objAisle.node.attributes["height"].value : "0";
        $scope.aisle.Points = $scope.aisle.Type.toString() === "3" ? polygon.node.attributes["points"].value : "0";

        if (isEdit) {
            $http({
                method: "PUT",
                url: "/api/aisle/edit",
                data: $scope.aisle
            }).then(function (res) {
                if (res.data.success) {
                    dialogSvc.showAlert("Information", "Successfully updated", "Ok", true, "parent", ev).then(function () {
                        $mdDialog.hide($scope.aisle);
                    });
                }
            }, function (err) {
                console.log(err);
            });

        } else {
            $http({
                method: "POST",
                url: "/api/aisle/add",
                data: $scope.aisle
            }).then(function (res) {
                if (res.data.success) {
                    dialogSvc.showAlert("Information", "Successfully added", "Ok", true, "parent", ev).then(function () {
                        $mdDialog.hide(res.data.row);
                    });
                }
            }, function (err) {
                console.log(err);
            });

        }


    }
});