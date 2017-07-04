var express = require('express');
var path = require('path');
var multer = require('multer');
var exceljs = require('exceljs');
var utl = require('../services/utilities');
var importSvc = require("../services/import");
var mapSvc = require('../services/map');
var dateFormat = require('dateformat');
var fs = require('fs');
var sizeOf = require('image-size');

function ImportRoute() {
    var upload = multer({ dest: './server/files/' });
    var router = express.Router();

    router.post('/upload', upload.single('myFile'), function (req, res) {
        if (!req.files) {
            res.status(400).json({ success: false, message: "No file(s) were uploaded." });
        } else {
            var tFile = req.files.myFile;
            var filename = "importedExcel" + dateFormat(new Date(), "yyyymmddhhMMssTT") + ".xlsx";
            tFile.mv('./server/files/' + filename, function (err) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    });
                } else {
                    var wb = new exceljs.Workbook();
                    wb.xlsx.readFile('./server/files/' + filename)
                        .then(function (result, error) {
                            var listStore = [];
                            var ignoreFirstRow = true;
                            for (var i = 0; i < wb.worksheets.length; i++) {
                                ignoreFirstRow = true;
                                wb.worksheets[i].eachRow({ includeEmpty: true }, function (value, key) {
                                    if (!ignoreFirstRow) {
                                        var newStore = {
                                            UUID: value.values[1] || "",
                                            Name: value.values[2] || "",
                                            Address: value.values[3] || "",
                                            ContactNumber: value.values[4] || "",
                                            SheetNumber: i + 1
                                        };

                                        listStore.push(newStore);
                                    }

                                    ignoreFirstRow = false;
                                });
                            }

                            // remove file
                            fs.unlink('./server/files/' + filename, (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Deleted file: " + filename);
                                }
                            });
                            res.status(200).json({
                                success: true,
                                message: "File upload success.",
                                rows: listStore,
                                worksheetNumber: wb.worksheets.length
                            });
                        });
                }
            })
        }
    });

    router.post('/uploadProducts', upload.single('myFile'), function (req, res) {
        if (!req.files) {
            res.status(400).json({ success: false, message: "No file(s) were uploaded." });
        } else {
            var tFile = req.files.myFile;
            var filename = "productsExcel" + dateFormat(new Date(), "yyyymmddhhMMssTT") + ".xlsx";
            tFile.mv('./server/files/' + filename, function (err) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    });
                } else {
                    var wb = new exceljs.Workbook();
                    wb.xlsx.readFile('./server/files/' + filename)
                        .then(function (result, error) {
                            var listStore = [];
                            var ignoreFirstRow = true;
                            for (var i = 0; i < wb.worksheets.length; i++) {
                                ignoreFirstRow = true;
                                wb.worksheets[i].eachRow({ includeEmpty: true }, function (value, key) {
                                    if (!ignoreFirstRow) {
                                        var data = value.values[3] ? value.values[3].toString() : "";
                                        var products = data.split(",");
                                        products.forEach(prod => {
                                            if (prod.trim() !== "") {
                                                var newProduct = {
                                                    AisleNumber: value.values[1] || "",
                                                    Name: prod.toString().trim() || "",
                                                    Category: value.values[2] || "",
                                                    Occasion: value.values[4] || "",
                                                    Comment: value.values[5] || "",
                                                    SheetNumber: i + 1
                                                };
                                                listStore.push(newProduct);
                                            }
                                        });
                                    }

                                    ignoreFirstRow = false;
                                });
                            }

                            // remove file
                            fs.unlink('./server/files/' + filename, (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Deleted file: " + filename);
                                }
                            });
                            res.status(200).json({
                                success: true,
                                message: "File upload success.",
                                rows: listStore,
                                worksheetNumber: wb.worksheets.length
                            });
                        });
                }
            })
        }
    });

    router.post('/stores', function (request, response) {
        // list of stores
        var listStore = request.body.listStore || [];
        var userid = request.body.userid;

        importSvc.importStores(userid, listStore, function (result, error) {
            if (!error) {
                response.status(result.status).json(result);
            } else {
                response.status(error.status).json(error);
            }
        })
    });

    router.post('/products', function (request, response) {
        // list of products
        var listProduct = request.body.listProduct || [];

        importSvc.importProducts(listProduct, function (result, error) {
            if (!error) {
                response.status(result.status).json(result);
            } else {
                response.status(error.status).json(error);
            }
        });
    });

    router.post('/photo', upload.single('myPhoto'), function (request, response) {
        var filename = request.query["filename"] || "default.jpg";
        var storeid = request.query["storeid"] || 0;
        var directory = './public/assets/images/stores/' + storeid;
        var newFilename = directory + "/" + filename;
        if (!request.files) {
            response.status(400).json({ success: false, message: "No file(s) were uploaded." });
        } else {
            var tFile = request.files.myPhoto;
            fs.exists(directory, (res) => {
                if (!res) {
                    fs.mkdir(directory);
                }
                tFile.mv(newFilename, function (err) {
                    if (err) {
                        response.status(500).json({
                            success: false,
                            message: "Image upload failed.",
                            details: err
                        });
                    } else {
                        response.status(200).json({
                            success: true,
                            message: "Image upload success."
                        });
                    }
                });
            });
        }
    });

    router.get('/getPhotos', function (request, response) {
        var uuid = request.query["storeid"] || 0;
        fs.readdir('./public/assets/images/stores/' + uuid, function (err, files) {
            if (err) {
                response.json({
                    success: false,
                    message: "No file(s) found."
                });
            } else {
                response.json({
                    success: true,
                    files: files.filter(obj => obj.indexOf('.jpg') > -1 ||
                        obj.indexOf('.png') > -1 ||
                        obj.indexOf('.gif') > -1),
                    message: "File(s) found."
                });
            }
        });
    });

    router.post('/setFeaturedPhoto', function (request, response) {
        var filename = request.body.filename;
        var storeid = request.body.storeid;

        var directory = './public/assets/images/stores/' + storeid + '/';
        var oldFile = directory + filename;
        var newFile = directory + '/default' + filename;

        fs.readdir(directory, function (err, files) {
            files.forEach((file, key) => {
                if (file.indexOf('default') > -1) {
                    var newFilename = file.replace('default', '');
                    fs.rename(directory + file, directory + newFilename, (err) => {
                        if (err) {
                            response.status(500).json({
                                success: false,
                                message: "Renaming of file failed.",
                                details: err
                            });
                        }
                    });
                }
            });
            // rename the new featured photo
            fs.rename(oldFile, newFile, (err) => {
                if (err) {
                    response.status(500).json({
                        success: false,
                        message: "Renaming of file failed.",
                        details: err
                    });
                } else {
                    response.status(200).json({
                        success: true,
                        message: "Setting of featured photo success."
                    });
                }
            });
        });
    });

    router.post('/map', upload.single('myMap'), function (request, response) {
        var storeid = request.query["storeid"] || 0;
        var directory = './public/assets/maps/' + storeid;
        if (!request.files) {
            response.status(400).json({ success: false, message: "No file(s) were uploaded." });
        } else {
            var tFile = request.files.myMap;
            var filename = tFile.name || "default.jpg";
            var newFilename = directory + "/" + filename;
            fs.exists(directory, (res) => {
                if (!res) {
                    fs.mkdir(directory);
                }
                tFile.mv(newFilename, function (err) {
                    if (err) {
                        response.status(500).json({
                            success: false,
                            message: "Map upload failed.",
                            details: err
                        });
                    } else {
                        sizeOf(newFilename, function (err_1, dimensions) {
                            if (err) {
                                response.status(500).json({
                                    success: false,
                                    message: "Map upload failed.",
                                    details: err
                                });
                            } else {
                                var params = [
                                    storeid,
                                    filename,
                                    dimensions.width,
                                    dimensions.height
                                ];

                                mapSvc.add(params, function (result, error) {
                                    if (!error) {
                                        response.status(result.status).json(result.data);
                                    } else {
                                        response.status(error.status).json(error.data);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });

    return router;
}

module.exports = ImportRoute();