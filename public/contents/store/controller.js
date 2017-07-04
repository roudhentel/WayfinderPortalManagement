mainApp.controller("storeCtrl", function ($scope, $state, $http, Dialog) {
    // variable declarations
    var dialogSvc = new Dialog();
    $scope.listPhotos = [];
    $scope.listCategories = [];
    $scope.listProduct = [];
    $scope.aisleProducts = [];
    $scope.listMaps = [];
    $scope.listSearchTerms = [];
    $scope.listAisle = [];
    $scope.listAisleRoute = [];
    $scope.primaryMap = 0;
    $scope.selMapId = 0;
    $scope.svg = {};
    $scope.displayedPhoto = "";
    $scope.getMapAisleFlag = undefined;
    $scope.getProductsFlag = true;

    var tempx = 0;
    var tempy = 0;
    setTimeout(() => {
        $scope.svg = Snap("#svg-map-selected").click(function (ev) {
            $('.context-menu').css("display", "none");
        });
    });


    // initialize variable
    $scope.params = $state.params;
    $scope.store = {};
    var st = $scope.global.listStore.find(obj =>
        obj.StoreId.toString() === $state.params.store.toString());

    $scope.store = st ? st : $scope.global.listFavorite.find(obj =>
        obj.StoreId.toString() === $state.params.store.toString());

    $scope.addPhoto = function (ev) {
        dialogSvc.showDialog("addPhotoCtrl", $scope, "/contents/store/add-photo.html", false, "parent", ev)
            .then(function (response) {
                $scope.getAllPhotos();
            });
    }

    $scope.addMap = function (ev) {
        dialogSvc.showDialog("addMapCtrl", $scope, "/contents/store/add-map.html", false, "parent", ev)
            .then(function (response) {
                if (response) {
                    $scope.listMaps.push(response);
                }
            });
    }

    // $scope.getDisplayMap = function (selectedMap) {
    //     var selMap = $scope.listMaps.find(obj => obj.Id === selectedMap);
    //     return selMap ? "/assets/maps/" + $scope.store.StoreId + "/" + selMap.Filename : "";
    // }

    $scope.viewMap = function (ev, item, idx) {
        $scope.selectedProduct = item;
        dialogSvc.showDialog("mapViewDialogCtrl", $scope, "/contents/store/map-view-dialog.html", false, "parent", ev)
            .then(function (response) {
                if (response) {
                    // $scope.getAllMaps();
                }
            });
    }

    $scope.getAllPhotos = function () {
        $http({
            method: "GET",
            url: "/api/import/getPhotos",
            params: {
                storeid: $scope.store.StoreId
            }
        }).then(function (response) {
            if (response.data.success) {
                $scope.listPhotos = response.data.files;
                $scope.defaultPhoto = response.data.files.find(obj => obj.indexOf('default') > -1) || "";
                $scope.displayedPhoto = "/assets/images/stores/" + $scope.store.StoreId + "/" + $scope.defaultPhoto;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.getAllMaps = function () {
        $http({
            method: "GET",
            url: "/api/map/getall",
            params: {
                storeid: $scope.store.StoreId
            }
        }).then(function (response) {
            if (response.data.success) {
                $scope.listMaps = response.data.rows;
                var primaryMap = $scope.listMaps.find(obj => obj.IsPrimary === 1);
                $scope.primaryMap = $scope.selectedMap = primaryMap ? primaryMap.Id : 0;
                if (primaryMap) {
                    $scope.changeMap(primaryMap.Id);
                }
                $scope.getMapsAisle();
            }
        }, function (error) {
            $scope.getMapsAisle();
            console.log(error);
        });
    }

    $scope.getMapsAisle = function () {
        $scope.getMapAisleFlag = true;
        $http({
            method: "GET",
            url: "/api/aisle/getByStoreId",
            params: {
                id: $scope.store.StoreId
            }
        }).then(function (res) {
            if (res.data.success) {
                $scope.listAisle = res.data.rows;
            }
            getAllCategories();
            $scope.getMapAisleFlag = false;
        }, function (err) {
            getAllCategories();
            $scope.getMapAisleFlag = false;
            console.log(err);
        });
    }

    $scope.getStoreAisleRoutes = function () {
        $http({
            method: "GET",
            url: "/api/aisle/getRoutesByUuid",
            params: {
                storeuuid: $scope.store.UUID,
                mapid: 0,
                aisleid: 0
            }
        }).then(function (response) {
            if (response.data.success) {
                $scope.listAisleRoute = response.data.rows;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.changeMap = function (mapId) {
        if ($scope.svgMap) {
            // remove existing viewed route's if any
            $scope.svg.selectAll("circle").remove();
            $scope.svg.selectAll("polyline").remove();

            $scope.svg.selectAll("rect").remove();
            $scope.svg.selectAll("polygon").remove();
            $scope.svgMap.remove();
        }

        var selMap = $scope.listMaps.find(obj => obj.Id === mapId);

        if (selMap) {
            $scope.svg.attr({
                "viewBox": "0 0 " + selMap.Width + " " + selMap.Height
            });

            $scope.svgMap = $scope.svg.image("/assets/maps/" + $scope.store.StoreId + "/" + selMap.Filename, 0, 0, 100, 100).attr({
                width: selMap.Width + "px",
                height: selMap.Height + "px"
            });

            $(".map-container").width("100%");
            $(".map-container").height("100%");

            $scope.selMapId = mapId;
            $scope.redrawAisle();
        }
    }

    $scope.redrawAisle = function () {
        var filteredAisle = $scope.listAisle.filter(obj => obj.MapId.toString() === $scope.selMapId.toString());
        if (filteredAisle && filteredAisle.length > 0) {
            $scope.svg.selectAll("rect").remove();
            $scope.svg.selectAll("polygon").remove();

            for (let i = 0; i < filteredAisle.length; i++) {
                var aisle = filteredAisle[i];
                if (aisle.Type.toString() === "3") {
                    // polyline
                    $scope.svg.polygon().attr({
                        'fill': "green",
                        'stroke': "black",
                        'aisleId': aisle.Id,
                        'points': aisle.Points
                    }).hover(function (ev) {
                        this.attr({ 'fill': 'red', 'cursor': 'pointer' });
                    }, function (ev) {
                        this.attr({ 'fill': 'green' });
                    }).click(function (ev) {
                        ev.stopPropagation();
                        $scope.showContextMenu(ev, this.node.attributes["aisleId"].value);
                    });
                } else {
                    // rect and oval
                    $scope.svg.rect(aisle.X, aisle.Y, aisle.Width, aisle.Height, aisle.Rx, aisle.Ry)
                        .attr({
                            'fill': 'green',
                            'stroke': 'black',
                            'aisleId': aisle.Id
                        }).hover(function (ev) {
                            this.attr({ 'fill': 'red', 'cursor': 'pointer' });
                        }, function (ev) {
                            this.attr({ 'fill': 'green' });
                        }).click(function (ev) {
                            ev.stopPropagation();
                            $scope.showContextMenu(ev, this.node.attributes["aisleId"].value);
                        });
                }
            }
        }
    }

    $scope.showContextMenu = function (ev, aisleId) {
        $('.context-menu').css("display", "block");
        $('.context-menu').css("top", ev.layerY);
        $('.context-menu').css("left", ev.layerX);

        // remove existing viewed route's if any
        $scope.svg.selectAll("circle").remove();
        $scope.svg.selectAll("polyline").remove();

        $scope.selectedAisle = $scope.listAisle.find(obj => obj.Id.toString() === aisleId.toString());

        $scope.aisleProducts = $scope.listProduct.filter(obj => obj.AisleNumber.indexOf($scope.selectedAisle.Id.toString()) > -1);
        $scope.$digest();
    }

    $scope.getSearchTerms = function () {
        $http({
            method: "GET",
            url: "/api/search/getSearchTerms",
            params: {
                uuid: $scope.store.UUID,
                deviceid: 0
            }
        }).then(function (response) {
            if (response.data.success) {
                $scope.listSearchTerms = response.data.rows;
            }
        }, function (error) {
            console.log(error);
        })
    }

    $scope.setPrimaryMap = function (ev) {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to set this map as primary?", "Yes", "No", false, "parent", ev)
            .then(function (res) {
                if (res) {
                    $http({
                        method: "PUT",
                        url: "/api/map/setprimary",
                        data: {
                            id: $scope.selMapId,
                            storeid: $scope.store.StoreId
                        }
                    }).then(function (response) {
                        if (response.data.success) {
                            dialogSvc.showAlert("Information", "This map is set as primary.", "Ok", true, "parent", ev)
                                .then(function () {
                                    $scope.primaryMap = $scope.selMapId;
                                });
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            });
    }

    $scope.setFeaturedPhoto = function (ev) {
        if ($('.carousel-inner div.item.active').length > 0) {
            var filename = $('.carousel-inner div.item.active').attr('filename');

            if (filename.indexOf('default') > -1) {
                dialogSvc.showAlert("Information", "This image is already set as the Featured Photo.", "Ok", true, "parent", ev);
            } else {
                $http({
                    method: "POST",
                    url: "/api/import/setFeaturedPhoto",
                    data: {
                        filename: filename,
                        storeid: $scope.store.StoreId
                    }
                }).then(function (response) {
                    if (response.data.success) {
                        $scope.defaultPhoto = "default" + filename;
                        $scope.displayedPhoto = "/assets/images/stores/" + $scope.store.StoreId + "/" + $scope.defaultPhoto;
                    }
                }, function (error) {
                    console.log(error);
                });

            }
        } else {
            // no uploaded image yet
        }
    }

    // adding of product
    $scope.showAddDialog = function (ev) {
        $scope.dialogHeader = "Add Product";
        dialogSvc.showDialog("productDialogCtrl", $scope, "/contents/product/product-dialog.html", false, "parent", ev)
            .then(function (product) {
                if (product) {
                    var cat = $scope.listCategories.find(obj => obj.Id.toString() === product.CategoryId.toString())
                    product["Category"] = cat ? cat.Name : "";
                    product["AisleNumber"] = product["AisleNumber"].split(',');
                    product["AisleDescription"] = getDescription(product);
                    $scope.listProduct.push(product);
                    $scope.rebuildTable();
                }
            });
    }

    getDescription = function (product) {
        var arr = product.AisleNumber,
            newDesc = "";
        arr.forEach(item => {
            var a = $scope.listAisle.find(aisle => aisle.Id === parseInt(item));
            newDesc += a ? (a.Description + ", ") : "";
        });
        newDesc = newDesc.length > 0 ? newDesc.substring(0, newDesc.length - 2) : newDesc;
        return newDesc;
    }

    // editing of product
    $scope.showEditDialog = function (ev, item, idx) {
        $scope.dialogHeader = "Edit Product";
        $scope.selectedProduct = item;
        dialogSvc.showDialog("productDialogCtrl", $scope, "/contents/product/product-dialog.html", false, "parent", ev)
            .then(function (product) {
                if (product) {
                    var cat = $scope.listCategories.find(obj => obj.Id.toString() === product.CategoryId.toString())
                    product["Category"] = cat ? cat.Name : "";
                    product["AisleDescription"] = getDescription(product);
                    $scope.listProduct[idx] = product;
                    $scope.rebuildTable();
                }
            });
    }

    // deleting of product
    $scope.deleteProduct = function (ev, item, idx) {
        dialogSvc.showConfirm("Confirmation", ("Are you sure you want to delete " + item.Name + "?"), "Yes", "No", false, "parent", ev)
            .then(function (result) {
                if (result) {
                    $http({
                        method: "DELETE",
                        url: "/api/product/delete",
                        params: {
                            id: item.Id
                        }
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.success) {
                            $scope.listProduct.splice(idx, 1);
                            dialogSvc.showAlert("Information", "Successfully deleted.", "Ok", true, "parent", ev);
                            $scope.rebuildTable();
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }
            });
    }

    var getAllCategories = function () {
        $http({
            method: "GET",
            url: "/api/category/getAll"
        }).then(function (response) {
            if (response.data.success) {
                $scope.listCategories = response.data.rows;
            }
            getAllProducts();
        }, function (error) {
            console.log(error);
            getAllProducts();
        });
    }

    var getAllProducts = function () {
        $scope.getProductsFlag = true;
        $http({
            method: "GET",
            url: "/api/product/getAll",
            params: {
                storeid: $scope.store.StoreId
            }
        }).then(function (response) {
            if (response.data.success) {
                var products = response.data.rows;
                products.forEach(obj => obj.AisleNumber = obj.AisleNumber.split(','));
                $scope.listProduct = products;
                $scope.getProductsFlag = false;
                $scope.rebuildTable();
            }
        }, function (error) {
            console.log(error);
            $scope.getProductsFlag = false;
        });
    }

    var createDataTable = function () {
        setTimeout(function () {
            $scope.productTbl = $("#tblListProduct").DataTable({
                "columns": [
                    { "width": "7%" }, // Action
                    { "width": "10%" }, // Aisle Number
                    { "width": "15%" }, // Name
                    { "width": "20%" }, // Category
                    { "width": "15%" }, // Occasion
                    { "width": "13%" }, // Comment
                    { "width": "10%" }, // Date Added
                    { "width": "10%" }  // Date Modified
                ],
                "oLanguage": {
                    "sProcessing": "loading data..."
                }
            });
        }, 100);
    }

    $scope.rebuildTable = function () {
        if ($scope.productTbl) $scope.productTbl.destroy();
        createDataTable();
    }

    $scope.showImportDialog = function (ev) {
        dialogSvc.showDialog("importProdDialogCtrl", $scope, "contents/store/import-dialog.html", false, "parent", ev)
            .then(function (result) {
                if (result) {
                    getAllProducts();
                }

            });
    }

    $scope.getAllPhotos();
    //getAllCategories();
    $scope.getAllMaps();
    $scope.getSearchTerms();
    $scope.getStoreAisleRoutes();
});