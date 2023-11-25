const map = [
    "########",
    "#000000#",
    "#P0BB00#",
    "#000S00#",
    "#000#00#",
    "#000S00#",
    "#000000#",
    "########",
]; // load level from levels.json file.

const cell_types = {
    "#": '<div class="cell wall"></div>',
    "P": '<div class="cell player"></div>',
    "B": '<div class="cell box"></div>',
    "S": '<div class="cell switch"></div>',
    "0": '<div class="cell"></div>'
};

var player = null; // denoted with P
var boxes = []; // position of all the boxes on the map. denoted with B
var switches = []; // position of all the switches on the map. denoted with S

var END = false;
// NOTE: no of boxes and no of switches should be equal on the map.

var grid = document.getElementById("grid");

function draw_level() {
    let html = '';

    map.forEach((row, y) => {
        html += '<div class="row">';
        
        [...row].forEach((cell, x) => {
            html += cell_types[cell] || cell_types['0'];

            if (cell === "P") {
                player = [y,x];
            }

            if (cell === "B") {
                boxes.push([y,x]);
            }

            if (cell === "S") {
                switches.push([y,x]);
            }
        });

        html += '</div>'
    });

    grid.innerHTML = html;
}

// recursive check of objects to given position
function prepare_move(pos, type="player") {
    let el = (grid.children[pos[0]]).children[pos[1]];
    if (has_class(el, "wall"))
        return false;

    if (has_class(el, "box"))
        if (type === "box")
            return false;
        else if (type === "player")
            if (!push_box(pos, matx_diff(pos, player)))
                return false;
    return true;
}

function push_box(pos, v) {
    let pushed = false
    for (i in boxes) {
        let box = boxes[i];
        if (box[0] === pos[0] && box[1] === pos[1]) {
            let next_cell = add_matx([...box], v);
            let can_move = prepare_move(next_cell, "box");

            if (!can_move) break;

            let box_cell = (grid.children[box[0]]).children[box[1]];
            remove_class(box_cell, 'box');
            
            add_matx(box, v);
            
            box_cell = (grid.children[box[0]]).children[box[1]];
            add_class(box_cell, 'box');
            pushed = true
            break;
        }
    }
    return pushed;
}

function check_end() {
    let end = true;

    for(i in switches) {
        let s = switches[i];
        let pressed = false;
        
        for (j in boxes) {
            let box = boxes[j];
            if (compare_matx(s, box)) {
                pressed = true;
                break;
            }
        }

        end = end && pressed;
        if (!end) break;
    }

    return end;
}

function move_player(v) { // move item on pos using velocity v
    let next_cell = add_matx([...player], v);
    let can_move = prepare_move(next_cell);

    if (!can_move) return;

    let player_cell = (grid.children[player[0]]).children[player[1]];
    remove_class(player_cell, 'player');
    
    add_matx(player, v);
    
    player_cell = (grid.children[player[0]]).children[player[1]];
    add_class(player_cell, 'player');

    // check if all the switches are pushed
    END = check_end()
    if (END) {
        document.getElementById("message").innerHTML = "<h3>Puzzle Solved!</h3>"
    }
}

function keypress (key) {
    if (END) return;

    let v = [0,0];

    if (key === "ArrowUp") {
        v = [-1, 0];
    }

    if (key === "ArrowDown") {
        v = [1, 0];
    }

    if (key === "ArrowLeft") {
        v = [0, -1];
    }

    if (key === "ArrowRight") {
        v = [0, 1];
    }

    move_player(v);
}

function Init() {
    draw_level();

    window.addEventListener('keydown', e => keypress(e.key));
}

Init();