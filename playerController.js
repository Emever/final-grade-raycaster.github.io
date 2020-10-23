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
        o cargar array de rayos del FOV [ ]
        o altura y diferentes niveles   [ ]
    
    estado:
        > en proceso...
*/

const FOV = degreesToRadians(75); //recomendado numero impar
const FOV_NUM_RAYS = 30;
const FOV_ANGLE_SPACING = FOV / (FOV_NUM_RAYS - 1);

class Ray {
    constructor(x,y,direction) {
        this.oX = x;    // origin x position
        this.oY = y;    // origin y position
        this.direction = direction; // angulo del rayo (rads.)
        this.dX = x;    // destination x position
        this.dY = y;    // destination y position
        this.distance = 100;  // distancia recorrida por el rayo
    }

    render() {
        stroke('rgba(0,200,255,0.3)');
        strokeWeight(1);
        line(objPlayer.x,
            objPlayer.y,
            objPlayer.x + MAP_SCALING * (this.distance * Math.cos(this.direction)),
            objPlayer.y + MAP_SCALING * (this.distance * Math.sin(this.direction)),
        );
    }
}

class FieldOfView {
    constructor() {
        this.angleView = -Math.PI/2;
        this.fovSpeed = 2 * Math.PI / 180;
        this.turnDirection = 0; // -1 == left, 1 == right

        this.rays = [];
    }

    update() {
        this.angleView += this.turnDirection * this.fovSpeed;
        this.angleView = normalizeAngle(this.angleView);

        this.castFOVRays();
    }

    castFOVRays() {
        this.rays = [];

        let rayAngle = this.angleView - FOV/2;
        for (let iRay = 0; iRay < FOV_NUM_RAYS; iRay++) {
            this.rays.push(new Ray(this.oX, this.oY, rayAngle));
            rayAngle += FOV_ANGLE_SPACING;
        }
    }

    render() {
        // Player main angle view render - - - - - - - - - - - - - - - - - - 
        stroke(0,200,255);
        strokeWeight(1);
        /*
        line(MAP_SCALING * this.oX,
            MAP_SCALING * this.oY,
            0,
            0
        );*/
        line(MAP_SCALING * objPlayer.x,
            MAP_SCALING * objPlayer.y,
            MAP_SCALING * (objPlayer.x + 100 * Math.cos(this.angleView)),
            MAP_SCALING * (objPlayer.y + 100 * Math.sin(this.angleView))
        );

        // FOV rays main angle view render - - - - - - - - - - - - - - - - - - 
        for (let iRay=0; iRay < FOV_NUM_RAYS; iRay++) this.rays[iRay].render();
    }
}

class Player {
    constructor(oX, oY, oLevel) {
        this.level = oLevel;
        this.x = oX;
        this.y = oY;
        this.fov = new FieldOfView(this.x, this.y);
        this.movSpeed = 1.5;    // el jugador avanza 1.5 px/frame
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
        let dx = this.x + this.walkDirection*this.movSpeed * Math.cos(this.fov.angleView);
        let dy = this.y + this.walkDirection*this.movSpeed * Math.sin(this.fov.angleView);
        // tratamos X e Y por separado: el jugador tal vez no pueda moverse en X pero si en Y.
        if (!objMap.hasWallAtX(dx, this.y, this.level)) this.x = dx;
        if (!objMap.hasWallAtY(this.x, dy, this.level)) this.y = dy;
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