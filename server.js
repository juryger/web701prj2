// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors')

// Global
var path = require('path');
global.appRoot = path.resolve(__dirname);
console.log("rootPath: " + global.appRoot);

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// Apply the routes to our application
app.use("/api", require("./routes/api"));

// Start server
app.listen(8081, function() {
    console.log('CORS-enabled web server listening on port 8081')
});