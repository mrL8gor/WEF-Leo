let colorP = document.querySelector("#colorPicker")
colorP.addEventListener('input', function (){
    boxColor=colorP.value
    redraw()
});

// console.log(ffffff)  
let boxColor=colorP.value; 

const unitLength = 30;
const strokeColor = '#FF00FF'; // greyscale
let columns; // To be determined by window width
let rows; // To be determined by window height
let currentBoard;
let nextBoard;
let slider;
let button1;
let button2;


function setup() {
    let canvas = createCanvas(windowWidth - 100, windowHeight - 100);
    canvas.parent(document.querySelector("#canvas"));
    slider = createSlider(1, 100, 20, 2);
    slider.position();
    slider.style('width', '200px');
    // slider.parent(document.querySelector(#sliderjj))
    frameRate(slider.value());


    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    currentBoard = [];

    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
    }
    console.log(currentBoard)

    init()

    noLoop()
    console.log(currentBoard)
}



function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }

    // currentBoard[2][0] = 1
    // currentBoard[2][1] = 1
    // currentBoard[2][2] = 1
}

function randomButton() {
    init()
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let prob = random(0, 1)
            if (prob > 0.5) {
                currentBoard[i][j] = 1
            } else { currentBoard[i][j] = 0 }
        }
    }
    // console.log("random", currentBoard)
    redraw()
}

function draw() {
    frameRate(slider.value());
    background(255);
    if (isLooping()) {
        generate();
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                fill(boxColor);
            } else {
                fill(255);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

let loneliness1 = (document.getElementById('lonelinessRule').value);
let overpopulation1 = (document.getElementById('overpopulationRule').value);
let reproduction1 = (document.getElementById('reproductionRule').value);

function windowResized() { 
    resizeCanvas(windowWidth - 100, windowHeight - 100);
     //Calculate the number of columns and rows
     columns = floor(width / unitLength);
     rows = floor(height / unitLength);
     currentBoard = [];
     nextBoard = [];
     for (let i = 0; i < columns; i++) {
         currentBoard[i] = [];
         nextBoard[i] = [];
     }
} 



function generate() {

    console.log("generate")
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors +=
                        currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }
            if (currentBoard[x][y] == 1 && neighbors < loneliness1) {
                nextBoard[x][y] = 0; // Die of Loneliness
            } else if (currentBoard[x][y] == 1 && neighbors > overpopulation1) {
                nextBoard[x][y] = 0; // Die of Overpopulation
            } else if (currentBoard[x][y] == 0 && neighbors == reproduction1) {
                nextBoard[x][y] = 1; // New life due to Reproduction
            } else {
                nextBoard[x][y] = currentBoard[x][y];
            } // Stasis



            // Rules of Life
            // if (currentBoard[x][y] == 1 && neighbors < 2) {
            //     // Die of Loneliness
            //     nextBoard[x][y] = 0;
            // } else if (currentBoard[x][y] == 1 && neighbors > 3) {
            //     // Die of Overpopulation
            //     nextBoard[x][y] = 0;
            // } else if (currentBoard[x][y] == 0 && neighbors == 3) {
            //     // New life due to Reproduction
            //     nextBoard[x][y] = 1;
            // } else {
            //     // Stasis
            //     nextBoard[x][y] = currentBoard[x][y];
            // }

        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}


function mouseDragged() {
    // console.log("check mouseX,mouseY", mouseX, mouseY)
    if (mouseX >= unitLength * columns || mouseY >= unitLength * rows || mouseX < 0 || mouseY < 0) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    console.log("check x,y", x, y)
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}


function mousePressed() {
    console.log("mousePressed")
    noLoop();
    mouseDragged();
}

function mouseReleased() {
    //console.log("mouseReleased")
    //  loop();
}

window.addEventListener('resize', function (event) {

}, true);



document.querySelector("#start").addEventListener("click", function () {
    loop();
});

document.querySelector("#stop").addEventListener("click", function () {
    noLoop();
});

document.querySelector("#random").addEventListener("click", function () {
    randomButton();
});

document.querySelector("#reset-game").addEventListener("click", function () {
    init();
    loop()
});

document.getElementById('lonelinessRule').addEventListener('change', function () {
    loneliness1= (document.getElementById('lonelinessRule').value)
})

document.getElementById('overpopulationRule').addEventListener('change', function () {
    overpopulation1 = (document.getElementById('overpopulationRule').value);
})

document.getElementById('reproductionRule').addEventListener('change', function () {
    reproduction1 = (document.getElementById('reproductionRule').value);
})



