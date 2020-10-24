/*
    nombre: keyController.js
    descripcion: clase encargada de controlar las acciones del teclado

    funciones:
        - gestionar las teclas pulsadas y actualizar los bools del player acorde
    
    goals:
        o movimiento del jugador (input)    [x]
        o controlar fov del jugador (input) [x]
        o fishbowl effect del fov (input)   [x]
    
    estado:
        > terminado (por ahora no mas controles a anadir)
        > falta comprobar!
*/


const KeyW = 87;    // moverse hacia delante
const KeyA = 65;    // girar a la izquierda
const KeyS = 83;    // moverse hacia atras
const KeyD = 68;    // girar a la derecha

const KeyF = 70;    // switch efecto ojo de pez

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
    } else if (keyCode == KeyS) {
        objPlayer.walkDirection = -1*updateRate;
    } else if (keyCode == KeyD) {
        objPlayer.fov.turnDirection = 1*updateRate;
    } else if (keyCode == KeyA) {
        objPlayer.fov.turnDirection = -1*updateRate;
    }

    // level controls
    if (keyCode == KeyArrowUp) {
        objPlayer.level ++;
        if (objPlayer.level >= objMap.nLevels) objPlayer.level = 0;
    } else if (keyCode == KeyArrowDown) {
        objPlayer.level--;
        if (objPlayer.level < 0) objPlayer.level = objMap.nLevels-1;
    }

    // fishbowl effect
    if (keyCode == KeyF) {
        objPlayer.fishbowlEffect = !objPlayer.fishbowlEffect;
    }

}

function keyReleased() {
    if (keyCode == KeyW) {
        objPlayer.walkDirection = 0;
    } else if (keyCode == KeyS) {
        objPlayer.walkDirection = 0;
    } else if (keyCode == KeyD) {
        objPlayer.fov.turnDirection = 0;
    } else if (keyCode == KeyA) {
        objPlayer.fov.turnDirection = 0;
    }
}