// Dependencies
var express = require("express");
var router = express.Router();
var fs = require('fs');

// Routes
router.get("/snapshots", function(req, res) {
    // todo: add logic of selecting snapshot based on request
    var path = require('path');
    res.send(base64_encode(appRoot + "/images/nmit.png"));
});

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// Return router
module.exports = router;