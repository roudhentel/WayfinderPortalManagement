var utl = require('./utilities');
var dbase = require('./database');

function ImportService() {
    var importSvc = {
        importStores: function (userid, listStore, callback) {
            var listUserStore = [];

            // bulk insert on the stores table
            var sql = "INSERT INTO sca_wayfinder.stores (UUID, Name, Address, ContactNumber) VALUES ?";
            var values = utl.objectToArray(listStore);

            dbase.executeQuery(sql, values, function (result, error) {
                if (!error) {
                    if (result.affectedRows > 0) {
                        var id = result.insertId;
                        for (var i = 0; i < result.affectedRows; i++) {
                            listUserStore.push([userid, id++]);
                        }

                        // bulk insert on the user stores table
                        dbase.executeQuery("INSERT INTO sca_wayfinder.user_stores(UserId, StoreId) VALUES ?", listUserStore, function (result_1, error_1) {
                            if (!error_1) {
                                if (result_1.affectedRows > 0) {
                                    callback({
                                        status: 200,
                                        data: { success: true, message: "Successfully imported." }
                                    }, undefined);
                                } else {
                                    callback(undefined, {
                                        status: 200,
                                        data: { success: false, message: "There is an error adding to user store table" }
                                    });
                                }
                            } else {
                                callback(undefined, {
                                    status: 500,
                                    message: "Server Error",
                                    details: error_1
                                });
                            }
                        });
                    } else {
                        callback({
                            status: 200,
                            data: { success: false, message: "Nothing imported." }
                        }, undefined);
                    }

                } else {
                    callback(undefined, {
                        status: 500,
                        data: {
                            success: false,
                            message: "Server Error",
                            details: error
                        }
                    });
                }
            });
        },
        importProducts: function (listProduct, callback) {
            var _this = this;
            // save new category(ies)
            listProduct.sort(utl.dynamicSort("Category"));
            _this.saveCategory(listProduct, null, 0, callback);
        },
        saveCategory: function (listProduct, prevCategory, currIdx, callback) {
            var _this = this;
            if (currIdx < listProduct.length) {
                var currItem = listProduct[currIdx];
                if (currItem.CategoryId === 0) {
                    if (!prevCategory || prevCategory.toLowerCase() !== currItem.Category.toLowerCase()) {
                        // save new category
                        dbase.executeAddProcedure("sca_wayfinder.category_add", [currItem.Category], function (result, error) {
                            if (!error) {
                                listProduct[currIdx].CategoryId = result.data.row.Id;
                                // set prev category
                                prevCategory = currItem.Category;
                                delete listProduct[currIdx]["Category"];
                                _this.saveCategory(listProduct, prevCategory, ++currIdx, callback);
                            } else {
                                callback(undefined, {
                                    status: 500,
                                    message: "Error on saving new category",
                                    details: error
                                });
                            }
                        });
                    } else {
                        // update category from previous
                        listProduct[currIdx].CategoryId = listProduct[currIdx - 1].CategoryId;
                        delete listProduct[currIdx]["Category"];
                        _this.saveCategory(listProduct, prevCategory, ++currIdx, callback);
                    }

                } else {
                    // set prev category
                    prevCategory = currItem.Category;
                    delete listProduct[currIdx]["Category"];
                    _this.saveCategory(listProduct, prevCategory, ++currIdx, callback);
                }
            } else {
                // save to database
                _this.saveProducts(listProduct, callback);
            }
        },
        saveProducts: function (listProduct, callback) {
            //bulk insert on the stores table
            var sql = "INSERT INTO sca_wayfinder.products (AisleNumber, Name, Occasion, Comments, CategoryId, StoreId) VALUES ?";
            listProduct.forEach(obj => {
                delete obj["AisleDescription"];
                obj["AisleNumber"] = obj["AisleNumber"].join(",");
            });
            var values = utl.objectToArray(listProduct);

            dbase.executeQuery(sql, values, function (result, error) {
                if (!error) {
                    if (result.affectedRows > 0) {
                        callback({
                            status: 200,
                            data: {
                                success: true,
                                message: "Successfully imported."
                            }
                        });
                    } else {
                        callback({
                            status: 200,
                            data: { success: false, message: "Nothing imported." }
                        }, undefined);
                    }

                } else {
                    callback(undefined, {
                        status: 500,
                        data: {
                            success: false,
                            message: "Server Error",
                            details: error
                        }
                    });
                }
            });
        }
    };

    return importSvc;
}

module.exports = ImportService();