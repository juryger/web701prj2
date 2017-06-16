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

}
