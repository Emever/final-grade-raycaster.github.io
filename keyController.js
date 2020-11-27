/*
    nombre: keyController.js
    descripcion: clase encargada de controlar las acciones del teclado

    funciones:
        - gestionar las teclas pulsadas y actualizar los bools del player acorde
    
    goals:
        o movimiento del jugador (input)    [x]
        o controlar fov del jugador (input) [x]
        o fisheye effect del fov (input)   [x]
    
    estado:
        > terminado
*/


const KeyW = 87;    // moverse hacia delante
const KeyA = 65;    // girar a la izquierda
const KeyS = 83;    // moverse hacia atras
const KeyD = 68;    // girar a la derecha

const KeyQ = 81;
const KeyE = 69;

const KeyF = 70;    // switch efecto ojo de pez

const KeyR = 82;    // switch efecto ojo de pez

const KeyArrowUp = 38;      // subir 1 nivel de altura
const KeyArrowDown = 40;    // bajar 1 nivel de altura
const KeyArrowLeft = 37;
const KeyArrowRight = 39;

const KeySpace = 32;    // saltar
const keyLeftCtrl = 17; // agacharse

const KeyShift = 16;    // potenciador

function keyPressed() {
    let updateRate = 1;

    /*
    if (keyIsDown(KeyShift)) {
        console.log("Key is down");
        updateRate = 2;
    }
    */

    // player controls
    if (keyCode == KeyW) {
        objPlayer.walkDirection = 1*updateRate;
    }
    if (keyCode == KeyS) {
        objPlayer.walkDirection = -1*updateRate;
    }
    if (keyCode == KeyA) {
        objPlayer.flankDirection = -1*updateRate;
    }
    if (keyCode == KeyD) {
        objPlayer.flankDirection = 1*updateRate;
    }
    if (keyCode == KeyQ || keyCode == KeyArrowLeft) {
        objPlayer.fov.turnDirection = -1*updateRate;
    }
    if (keyCode == KeyE || keyCode == KeyArrowRight) {
        objPlayer.fov.turnDirection = 1*updateRate;
    }

    // level controls
    if (keyCode == KeyArrowUp) {
        objPlayer.level ++;
        if (objPlayer.level >= objMap.nLevels) objPlayer.level = 0;
    } else if (keyCode == KeyArrowDown) {
        objPlayer.level--;
        if (objPlayer.level < 0) objPlayer.level = objMap.nLevels-1;
    }

    // fisheye effect
    if (keyCode == KeyF) {
        objPlayer.fisheyeEffect = !objPlayer.fisheyeEffect;
    }

    // reload FPS
    if (keyCode == KeyR) {
        reloadFPS();
    }

}

function keyReleased() {
    if (keyCode == KeyW) {
        objPlayer.walkDirection = 0;
    }
    if (keyCode == KeyS) {
        objPlayer.walkDirection = 0;
    }
    if (keyCode == KeyA) {
        objPlayer.flankDirection = 0;
    }
    if (keyCode == KeyD) {
        objPlayer.flankDirection = 0;
    }
    if (keyCode == KeyQ || keyCode == KeyArrowLeft) {
        objPlayer.fov.turnDirection = 0;
    }
    if (keyCode == KeyE || keyCode == KeyArrowRight) {
        objPlayer.fov.turnDirection = 0;
    }
}