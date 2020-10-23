/*
    nombre: main.js
    funciones:
        - llamar a las funciones que ejecutan el programa
    
    goals:
        o funcionar
    
    estado:
        > en proceso...
*/

// global variables
var objMap = new Map();
//objMap.init();
var objPlayer = new Player(160,160,0);


function setup() {
    createCanvas(objMap.width * TILE_SIZE, objMap.height * TILE_SIZE);
    
    //objMap.consoleLogging();
    //objMap.render();
}

function update() {
    objPlayer.update();
}

function draw() {
    clear("#212121");
    fill("#565656");
    update();

    objMap.render();
    objPlayer.render();

    //rect(20,0,WINDOW_WIDTH,WINDOW_HEIGHT);
}