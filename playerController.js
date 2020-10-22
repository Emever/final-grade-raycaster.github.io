/*
    nombre: playerController.js
    descripcion: clase encargada de gestionar el funcionamiento del player y su FOV

    funciones:
        - inicializar tanta informacion como sea posible sobre el jugador
        - controlar el movimiento y las funciones del jugador
        - gestionar las funciones del campo de visión (FOV)
    
    goals:
        o movimiento del jugador (nCol) [x]
        o mov del jugador, colisiones   [ ]
        o mostrar el jugador en el mapa [x]
        o mostrar FOV del player (mapa) [ ]
        o cargar [] de rayos del FOV    [ ]
        o altura y diferentes niveles   [ ]
    
    estado:
        > en proceso...
*/

const FOV = 75; //recomendado numero impar
const NUM_RAYS = 6;

class Ray {
    constructor(x,y,direction) {
        this.oX = x;    // origin x position
        this.oY = y;    // origin y position
        this.direction = direction; // angulo del rayo (rads.)
        this.dX = x;    // destination x position
        this.dY = y;    // destination y position
        this.distance = 15;  // distancia recorrida por el rayo
    }
}

class FieldOfView {
    constructor(originX, originY) {
        this.oX = originX;
        this.oY = originY;
        this.angleView = -Math.PI/2;
        this.fovSpeed = 2 * Math.PI / 180;
        this.turnDirection = 0; // -1 == left, 1 == right

        this.rays = [];
    }

    update() {
        this.angleView += this.turnDirection * this.fovSpeed;
    }

    render() {
        stroke(0,200,255);
        /*
        line(MAP_SCALING * this.oX,
            MAP_SCALING * this.oY,
            0,
            0
        );*/
        line(MAP_SCALING * objPlayer.x,
            MAP_SCALING * objPlayer.y,
            MAP_SCALING * (objPlayer.x + 15 * Math.cos(this.angleView)),
            MAP_SCALING * (objPlayer.y + 15 * Math.sin(this.angleView))
        );
    }
}

class Player {
    constructor() {
        this.x = 160;
        this.y = 160;
        this.fov = new FieldOfView(this.x, this.y);
        this.movSpeed = 1.5;  // el jugador avanza 32 pixeles/segundo (a 60Hz)
        this.walkDirection = 0; // -1 == back, 1 == front

        this.fishbowlEffect = false;
    }

    update() {
        // actualizamos los rayos del fov del jugador (posicion, etc.)
        this.fov.update();
        // actualizamos la posicion del jugador
        this.movePlayer()
    }

    movePlayer() {
        this.x += this.walkDirection*this.movSpeed * Math.cos(this.fov.angleView);
        this.y += this.walkDirection*this.movSpeed * Math.sin(this.fov.angleView);
    }

    render() {
        this.fov.render();

        noStroke();
        fill(0,200,255);
        circle(MAP_SCALING * this.x,
            MAP_SCALING * this.y,
            MAP_SCALING * 4);
    }
}