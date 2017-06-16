// Dependencies
var express = require("express");
var bodyParser = require("body-parser");

// Global
var path = require('path');
global.appRoot = path.resolve(__dirname);
console.log("rootPath: " + global.appRoot);

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api", require("./routes/api"));

// Start server
app.listen(8081);
console.log("API is running on port 8081");