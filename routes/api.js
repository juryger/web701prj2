// Dependencies
var express = require("express");
var router = express.Router();
var fs = require('fs');

// Routes

// Snapshot request route 
// http://localhost:8081/api/snapshots/{sensor}
router.get("/snapshots/:sensor", function(req, res) {    
    // Note: if it's required to get a real snapshot from sensor, 
    //  it could be done by requesting corresponding sensor
    var snapshotFileName = "";
    switch(req.params.sensor.toUpperCase())
    {
        case "SNR-01":
            snapshotFileName = "nmit.png";
            break;
        case "SNR-02":
            snapshotFileName = "fairfield.png";
            break;
        case "SNR-03":
            snapshotFileName = "council.png";
            break;
        case "SNR-04":
            snapshotFileName = "church.png";
            break;
    }

    var path = require('path');
    res.send(snapshotFileName != "" ? 
        base64_encode(global.appRoot + "/images/" + snapshotFileName) : 
        "");
});

// Command processing route 
// http://localhost:8081/api/commands/{sensor}
router.post("/commands/:sensor", function(req, res) {    
    // read sensors.json
    var sensorsList = readSensorsFile();

    // find object associated with sensor
    var requestedObj = null;
    for (item of sensorsList.objects) {
        if (item.sensor.name.toUpperCase() == req.params.sensor.toUpperCase()) {
            requestedObj = item;
            break;
        }
    }

    if (requestedObj == null) {
        res.status(500).json({ error: 'Requested sensor is missed in repository. Sensor: ' + sensor });
        return;
    }

    // process command
    var commandName = req.body.commandName;
    var commandParam = req.body.commandParam;
    processSensorCommand(requestedObj, commandName, commandParam);
    
    // update sensors.json
    updateSensorsFile(sensorsList);

    // response with updated sensor object    
    res.json(requestedObj);
});

function processSensorCommand(sensorObj, commandName, commandParam) {
    switch (commandName.toUpperCase()) {
        case "ACTIVATE":
            sensorObj.sensor.status = "Normal";
            break;
        case "DEACTIVATE":
            sensorObj.sensor.status = "Inactive";
            break;
        case "RESET":
            sensorObj.sensor.status = "Normal";
            break;
        case "CUSTOM":
            break;
    }

    sensorObj.sensor.lastCommand = [commandName, commandParam, getDateTimeString(new Date())];
}

function getDateTimeString(dateTime) {
    return dateTime.getDate() + "/"
                + (dateTime.getMonth()+1)  + "/" 
                + dateTime.getFullYear() + " @ "  
                + dateTime.getHours() + ":"  
                + dateTime.getMinutes() + ":" 
                + dateTime.getSeconds();
}

function readSensorsFile() {    
    return JSON.parse(
        fs.readFileSync(
            global.appRoot + "/Data/sensors.json", 
            "utf8"));    
}

function updateSensorsFile(sensors) {
    fs.writeFile(
        global.appRoot + "/Data/sensors.json",
        JSON.stringify(sensors),
        "utf8",
        function(err) {
            if(err) throw err;
        });
}

// Function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// Return router
module.exports = router;