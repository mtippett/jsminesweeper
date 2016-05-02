function generate_minefield(width, height, mines) {

    // validate that the mines fit within the minefield
    if (width * height < mines) {
        $("#minefield").html("<p>More mines than cells</p>")
        return;
    }

    $("#status").html = "";
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
        if ($("#" + x + "_" + y + " div").length == 0) {
            $("#" + x + "_" + y).append("<div class=\"mine\"></div>");
        } else {
            console.log("Mine already present");
            mine--;
        }
    }
}

function mine_click(e) {
    // Check to see if the mine is present
    if ($("#" + e.target.id + " div").length > 0) {
        // game over clear map
        $("#status").html("<blink>You lose</blink>");
        minefield_expose();
    } else {
        //decode the target cell
        var target = e.target.id.split("_");

        // should handle an invalid target
        minefield_miss(target[0], target[1]);
    }
}

function minefield_expose() {
    var cells = $(".cell");
    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      var id = cells[cellIndex].id;
      $("#" + id).html(minefield_cell_by_id(id));

    }
}

function minefield_cell_by_id(id) {
  var target = id.split("_");

  if(target.length < 2) {
    return "error";
  } else {
    return minefield_cell(target[0],target[1]);
  }
}

function minefield_cell(x, y) {

   x = parseInt(x,10);
   y = parseInt(y,10);

   console.log("getting value for cell "+x+","+y)

    if ($("#" + x + "_" + y + " div").length > 0) {
        console.log("cell "+x+","+y+" is a bomb");
        return "💣<div class=\"mine\"></div>";
    } else {
        var mine_count = 0;
        for (var column = x - 1; column <= x + 1; column++) {
            for (var row = y - 1; row <= y + 1; row++) {
                // Rather than doing an explicit bounds check, rely on the jquery
                // selector to detect bordering mines
                console.log("checking "+column+","+row);
                if ($("#" + column + "_" + row + " div").length > 0) {
                    console.log("Adjacent cell "+column+","+row +
                          " for "+x+","+y+" contains mine");
                    mine_count++;
                }
            }
        }

        if (mine_count > 0) {
            return mine_count;
        } else {
            return "&nbsp;";
        }
    }
}

function minefield_miss(x, y) {
    // Scan surrounding cells for mines

    $("#" + x+"_"+y).html(minefield_cell(x,y));

}
