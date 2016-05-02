function generate_minefield(width, height, mines) {

    // validate that the mines fit within the minefield
    if (width * height < mines) {
        $("#minefield").html("<p>More mines than cells</p>")
        return;
    }

    $("#status").html="";
    $("#minefield").html("<table border=\"1\" id=\"minetable\"></table>")

    // Create a table of height rows
    for (var y = 0; y < height; y++) {
        $("#minetable").append("<tr id=\"row" + y + "\"></tr>");
        for (var x = 0; x < width; x++) {
            $("#row" + y).append("<td class=\"cell\" id=\"" + x + "_" + y + "\">?</td>");
            $("#" + x + "_" + y).click(function(e) {
                mine_click(e);
            });
        }
    }

    // Add a div to hold if there is a mine in it
    for (var mine = 0; mine < mines; mine++) {
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);

        // Append mine to the cell so we can look for it when we click
        if ($("#" + x + "_" + y +" div").length == 0) {
            $("#" + x + "_" + y).append("<div class=\"mine\"></div>");
        } else {
          console.log("Mine already present");
          mine--;
        }
    }
}

function mine_click(e) {
   // Check to see if the mine is present
   if($("#" + e.target.id + " div").length) {
      // game over clear map
      $("#status").html="<blink>You lose</blink>";
      minefield_expose();
   }
 }

function minefield_expose() {
  var cells = $(".cell");
  for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    console.log(cells[cellIndex]);
  }
}
