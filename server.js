// library
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');

// declaration & initialization
var port = process.env.port || 3000;
var http = require('http').Server(app);

// for file upload
app.use(fileUpload());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));


// to parse multi-part post
app.use(busboy());

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// user route
var userRoute = require('./server/routes/user');
app.use('/api/user', userRoute);

// store route
var storeRoute = require('./server/routes/store');
app.use('/api/store', storeRoute);

// import route
var importRoute = require('./server/routes/import');
app.use('/api/import', importRoute);

// category route
var categoryRoute = require('./server/routes/category');
app.use('/api/category', categoryRoute);

// product route
var productRoute = require('./server/routes/product');
app.use('/api/product', productRoute);

// map route
var mapRoute = require('./server/routes/map');
app.use('/api/map', mapRoute);

// search route
var searchRoute = require('./server/routes/search');
app.use('/api/search', searchRoute);

// aisle route
var aisleRoute = require('./server/routes/aisle');
app.use('/api/aisle', aisleRoute);

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// start with index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/");
});

// start app
http.listen(port, function () {
  console.log('Listening on ' + port);
});