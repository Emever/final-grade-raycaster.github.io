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
var objPlayer = new Player(162,162,0);
var objRender = new Render();


function setup() {
    createCanvas(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    //createCanvas(MAP_SCALING * objMap.width * TILE_SIZE, MAP_SCALING * (objMap.height + 2) * TILE_SIZE);

    //objMap.consoleLogging();
    objMap.render();
}

function update() {
    objPlayer.update();
    objRender.update();
}

function draw() {
    clear("#212121");
    fill("#565656");
    update();
    
    objRender.loadProjection();
    objMap.render();
    objPlayer.render();
    
    
    //rect(20,0,WINDOW_WIDTH,WINDOW_HEIGHT);
}