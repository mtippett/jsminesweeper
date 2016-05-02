function generate_minefield(width, height, mines) {

    // validate that the mines fit within the minefield
    if (width * height < mines) {
        $("#minefield").html("<p>More mines than cells</p>")
        return;
    }

    $("#minefield").html("<table border=\"1\" id=\"minetable\"></table>")

    // Create a table of height rows
    for (y = 0; y < height; y++) {
        $("#minetable").append("<tr id=\"row" + y + "\"></tr>");
        for (x = 0; x < width; x++) {
            $("#row" + y).append("<td id=\"" + x + "_" + y + "\">?</td>");
            $("#" + x + "_" + y).click(function(e) {
                mine_click(e);
            });
        }
    }
}

function mine_click(e) {
    console.log("clicked "+ e.target.id);
}
