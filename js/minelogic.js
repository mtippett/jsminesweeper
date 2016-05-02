function generate_minefield(width, height, mines) {

    // validate that the mines fit within the minefield
    if (width * height < mines) {
        $("#minefield").html("<p>More mines than cells</p>")
        return;
    }

    $("#status").html("");
    $("#minefield").html("<table border=\"1\" id=\"minetable\"></table>")

    // Create a table of height rows
    for (var y = 0; y < height; y++) {
        $("#minetable").append("<tr id=\"row" + y + "\"></tr>");
        for (var x = 0; x < width; x++) {
            $("#row" + y).append("<td width=\"10px\" class=\"cell\" id=\"" + x + "_" + y + "\">?</td>");
            $("#" + x + "_" + y)
                .click(function(e) {
                    mine_click(e);
                })
                .data("hidden", true);
        }
    }

    // Add a div to hold if there is a mine in it
    for (var mine = 0; mine < mines; mine++) {
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);


        // Append mine to the cell so we can look for it when we click
        if ($("#" + x + "_" + y).data("mine") != true) {
            $("#" + x + "_" + y).data("mine", true)
        } else {
            console.log("Mine already present");
            mine--;
        }
    }

    remainingCells = width * height - mines;

}

function mine_click(e) {

    var target = minefield_parse_id(e.target.id);
    var mine_count = minefield_cell(target[0], target[1]);

    if (mine_count < 0) {
        $("#status").html("<blink>You lose</blink>");
        minefield_expose();
    } else {
        minefield_expose_cell(target[0], target[1], mine_count);

        if (mine_count == 0) {
            minefield_expose_adjacent(target[0], target[1]);
            // find other cells with zero and expose them.
        }

        console.log("Remaining Cells = " + remainingCells)
        if (remainingCells == 0) {
            $("#status").html("<blink>You win</blink>");
            minefield_expose();
        }
    }
}

function minefield_expose() {
    var cells = $(".cell");
    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        var id = cells[cellIndex].id;
        // Should check to see if the cell has already been exposed
        minefield_expose_cell_by_id(id);
    }
}

function minefield_expose_cell_by_id(id) {
    var target = minefield_parse_id(id);

    minefield_expose_cell(target[0], target[1], minefield_cell(target[0], target[1]));
}

function minefield_expose_cell(x, y, count) {

    if ($("#" + x + "_" + y).data("hidden") == true) {
        console.log("Exposing cell " + x + "," + y);

        var content = "";

        $("#" + x + "_" + y)
            .off("click")
            .data("hidden", false);


        if (count < 0) {
            content = "💣";
        } else if (count == 0) {
            content = "&nbsp;";
            minefield_expose_adjacent(x, y);
        } else {
            content = count;
        }

        $("#" + x + "_" + y)
            .html(content);

        remainingCells--;
    } else {
        console.log("Skipping previously exposed cell " + x + "," + y);
    }

}

function minefield_parse_id(id) {

    var target = id.split("_");
    target[0] = parseInt(target[0], 10);
    target[1] = parseInt(target[1], 10);

    return target;

}


function minefield_cell_by_id(id) {
    var target = minefield_parse_id(id);

    if (target.length < 2) {
        return "error";
    } else {
        return minefield_cell(target[0], target[1]);
    }
}

function minefield_cell(x, y) {

    //console.log("getting value for cell " + x + "," + y)

    if ($("#" + x + "_" + y).data("mine") == true) {
        console.log("cell " + x + "," + y + " is a bomb");
        return -1;
    } else {
        var mine_count = 0;
        for (var column = x - 1; column <= x + 1; column++) {
            for (var row = y - 1; row <= y + 1; row++) {
                // Rather than doing an explicit bounds check, rely on the jquery
                // selector to detect bordering mines
                if ($("#" + column + "_" + row).data("mine") == true) {
                    console.log("Adjacent cell " + column + "," + row +
                        " for " + x + "," + y + " contains mine");
                    mine_count++;
                }
            }
        }

        if (mine_count > 0) {
            return mine_count;
        } else {
            return 0;
        }
    }
}

function minefield_expose_adjacent(locx, locy) {
    // Expose adjacent cells
    //mThis is recursive and not optimized
    for (var x = locx - 1; x <= locx + 1; x++) {
        for (var y = locy - 1; y <= locy + 1; y++) {
            if ($("#"+x+"_"+y).data("hidden") == true) {
                minefield_expose_cell_by_id(x + "_" + y);
            }
        }
    }

}
