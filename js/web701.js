/* 
 * ----------------------------------------------------------------------
 * Helper function for including information to Tooltip popup window 
 * ----------------------------------------------------------------------
 */
function tool_tip_show(left, top, d) {
    tooltip.style("left", left)
        .style("top", top);
    
    tooltip.select("#name")
        .text(d.sensor.name);
    
    applySensorStatus(tooltip.select("#status"), d.sensor.status);
                
    if (d.sensor.lastCommand == null) {
        tooltip.select("#lastCommand")
            .html("<p>Last command: No entry</p>" );
    } else {
        tooltip.select("#lastCommand")
            .html("Last command:<ul>" + 
                "<li>Type: " + d.sensor.lastCommand[0] + "</li>" + 
                "<li>Parameter: " + d.sensor.lastCommand[1] + "</li>" + 
                "<li>Processed" + d.sensor.lastCommand[2] + "</li>" + 
                "</ul>");
    }
}

/* Set the width of the side navigation to 250px */
function openNav(d) {
    commandBar.style("width", "250px");

    commandBar.select("#name")
        .text(d.sensor.name);

    applySensorStatus(commandBar.select("#status"), d.sensor.status);

    $('#sbCommand').prop('selectedIndex',0);
    $("#tbCommandParameter").val("");

    commandBar.select("#sbcActivate")
        .style("display", "none");
    commandBar.select("#sbcDeactivate")
        .style("display", "none");

    if (d.sensor.status.toLowerCase() == "normal" || d.sensor.status.toLowerCase() == "alarm") {
        commandBar.select("#sbcDeactivate")
            .style("display", "block");
    }
    
    if (d.sensor.status.toLowerCase() == "inactive")
        commandBar.select("#sbcActivate")
            .style("display", "block");

    commandBar.select("#tbCommandParameter").text("");

    getSensorSnapshot(d.sensor.name);
}

function getSensorSnapshot(sensorId) {
    var requestUrl = window.location.protocol + '//' + window.location.hostname  + ':8081/api/snapshots/' + sensorId;
    $.ajax({
        type:"GET",
        url: requestUrl,
        success: function(data){
            if (data == ""){
                commandBar.select("#snapshot-container")
                    .html("<img alt='Snapshot' src='images/snapshot3.png'></img>");
            }
            else {
                commandBar.select("#snapshot-container")
                    .html("<img alt='Snapshot' src='data:image/png;base64," + data + "'></img>");
            }
        },
        fail: function(data) {
            console.error(data);
        }
    });
}

function applySensorStatus(statusElement, statusValue) {
    statusElement.text("Status: " + statusValue);

    var colorAttribute = "black";
    if (statusValue.toLowerCase() == "normal")
        colorAttribute = "green";
    else if (statusValue.toLowerCase() == "inactive")
        colorAttribute = "gray";
    else if (statusValue.toLowerCase() == "alarm")
        colorAttribute = "red";

    statusElement.style("color", colorAttribute);
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    commandBar.style("width", "0");
}

function sendCommand() {
    var sensorId = commandBar.select("#name").text();
    var commandName = $('#sbCommand').find(":selected").val();
    var commandParam = $("#tbCommandParameter").val();

    if (commandName == "None") {
        console.warn("Select command and try again.");
        return;
    }

    var requestUrl = window.location.protocol + '//' + window.location.hostname  + ':8081/api/commands/' + sensorId;
    $.ajax({
        type:"POST",
        url: requestUrl,
        data: { "commandName": commandName, "commandParam": commandParam },
        success: function(data){
            var index = sensorData.objects.findIndex(x => x.sensor.name == data.sensor.name);
            if (index >= 0)
            {
                data.LatLng = new L.LatLng(
                    data.sensor.coordinates[0],
                    data.sensor.coordinates[1]);

                // remove object with old state
                sensorData.objects.splice(index, 1);

                // insert object with new state
                sensorData.objects.splice(index, 0, data);

                refreshSensors();

                closeNav();

                showNotification("Command has been processed.")
            }
        },
        fail: function(data) {
            console.error(data);
        }
    });
}

function showNotification(message) {    
    notificationBar.select("#notificationBarMsg")
            .text(message);

    notificationBar.style("display", "block");
}

function hideNotification() {
    notificationBar.style("display", "none");
}