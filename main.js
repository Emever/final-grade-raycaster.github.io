/*
    nombre: main.js
    funciones:
        - llamar a las funciones que ejecutan el programa
    
    goals:
        o cargar mapa       [x]
        o cargar jugador    [x]
        o mover jugador     [x]
        o fov jugador       [x]
        o mas de 1 nivel    [x]
        o colisiones fov    [x]
        o renderizar 3D     [x]
        o leer imagenes     [ ]
        o yOffset del render realista   [ ]
        o cargar mapa desde una imagen  [ ]
        o render suelo/cielo por imagen [ ]
        o texturas para los muros (img) [ ]
        o cargar diferentes muros       [ ]
        o efecto altura realista        [ ]
        o salto de jugador (Doom, etc.) [ ]
    
    estado:
        > en proceso...
*/

// global class variables
var imageLoader;

var objMap;
var objPlayer;
var objRender;

function preload() {
    initCustomConst();

    imageLoader = new ImageLoader();
    imageLoader.init();
}

function setup() {
    initSliders();

    imageLoader.loadImagesPixels();
    imageLoader.distributeImages();
    
    objMap = new Map();
    objPlayer = new Player(162, 162, 1, Math.PI/3);
    objRender = new Render();

    createCanvas(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    //createCanvas(cMAP_SCALING * objMap.width * TILE_SIZE, cMAP_SCALING * (objMap.height + 2) * TILE_SIZE);

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
}