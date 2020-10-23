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


const KeyW = 87;
const KeyA = 65;
const KeyS = 83;
const KeyD = 68;
const KeyF = 70;

const KeyShift = 16;

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