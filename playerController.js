/*
    nombre: playerController.js
    descripcion: clase encargada de gestionar el funcionamiento del player y su FOV

    funciones:
        - inicializar tanta informacion como sea posible sobre el jugador
        - controlar el movimiento y las funciones del jugador
        - gestionar las funciones del campo de visión (FOV)
    
    goals:
        o movimiento del jugador (nCol) [x]
        o mov del jugador, colisiones   [x]
        o mostrar el jugador en el mapa [x]
        o mostrar FOV del player (mapa) [x]
        o cargar array de rayos del FOV [x]
        o altura y diferentes niveles   [x]
    
    estado:
        > terminado
*/

const FOV = degreesToRadians(70); //recomendado numero impar
const FOV_NUM_RAYS = 160;
const FOV_ANGLE_SPACING = FOV / (FOV_NUM_RAYS - 1);

class Ray {
    constructor(direction) {
        this.direction = direction; // angulo del rayo (rads.)
        this.dX = 0;    // distance to x position
        this.dY = 0;    // distance to y position
        this.distance = objPlayer.fov.maxDistance;  // distancia recorrida por el rayo
        
        this.rayHitsVertically = false;
        this.rayImpactsOn = 0;  // 1 o + si impacta contra un muro: para saber que textura cargar en el renderer
    }

    cast() {
        let yWallhitResult = this.checkYWallhit();
        let xWallhitResult = this.checkXWallhit();
        if (yWallhitResult[2] < xWallhitResult[2]) {
            [this.dX, this.dY, this.distance, this.rayImpactsOn] = yWallhitResult;
            this.rayHitsVertically = true;
        } else
            [this.dX, this.dY, this.distance, this.rayImpactsOn] = xWallhitResult;

        if (!objPlayer.fisheyeEffect) {
            this.distance *= Math.cos(this.direction - objPlayer.fov.angleView);
        }
        
    }

    checkXWallhit() {
        // esta funcion detecta las colisiones del rayo a medida que su Y evoluciona (sube/baja de fila en la grid)
        // la primera distancia depende de la posición del jugador en la grid
        let rayGoesRight = (Math.cos(this.direction) < 0)? false : true;    // TRUE hacia la derecha, FALSE si va hacia la izquierda

        // los 'steps' es la distancia que se repetira en cada eje (x e y) hasta encontrar un muro
        let xStep = TILE_SIZE;  // verticalmente, siempre encontrara la siguiente coordenada de la grid a TILE_SIZE px de distancia
        xStep *= (rayGoesRight)? 1:-1;
        let yStep = xStep * Math.tan(this.direction);
        let xInit = Math.floor(objPlayer.x/TILE_SIZE) * TILE_SIZE - objPlayer.x;
        xInit += (rayGoesRight)? TILE_SIZE:0;
        let yInit = xInit * Math.tan(this.direction);
        
        let xDist = xInit;
        let yDist = yInit;

        // repetir hasta encontrar un muro
        while (!objMap.hasWallAt(objPlayer.x + xDist + ((rayGoesRight)? 0:-TILE_SIZE), objPlayer.y + yDist, objPlayer.level)) {
            xDist += xStep;
            yDist += yStep;
        }
        // miramos con que elemento ha chocado el rayo
        let collision = objMap.hasWallAt(objPlayer.x + xDist + ((rayGoesRight)? 0:-TILE_SIZE), objPlayer.y + yDist, objPlayer.level);
        
        return [xDist, yDist, getDistFromSidelength(xDist, yDist), collision];
    }

    checkYWallhit() {
        // esta funcion detecta las colisiones del rayo a medida que su Y evoluciona (sube/baja de fila en la grid)
        // la primera distancia depende de la posición del jugador en la grid
        let rayGoesUp = (Math.sin(this.direction) < 0)? true : false;       // TRUE si el rayo va hacia arriba, FALSE si va hacia abajo

        // los 'steps' es la distancia que se repetira en cada eje (x e y) hasta encontrar un muro
        let yStep = TILE_SIZE;  // verticalmente, siempre encontrara la siguiente coordenada de la grid a TILE_SIZE px de distancia
        let xStep = yStep / Math.tan(this.direction);
        let yInit = Math.floor(objPlayer.y/TILE_SIZE) * TILE_SIZE - objPlayer.y;
        yInit += (rayGoesUp)? 0 : TILE_SIZE;
        let xInit = yInit / Math.tan(this.direction);
        let yDist = yInit;
        let xDist = xInit;

        // repetir hasta encontrar un muro
        let sign = (rayGoesUp)? -1:1;
        
        while (!objMap.hasWallAt(objPlayer.x + xDist, objPlayer.y + yDist - ((rayGoesUp)? TILE_SIZE:0), objPlayer.level)) {
            xDist += xStep * sign;
            yDist += yStep * sign;
        }
        let collision = objMap.hasWallAt(objPlayer.x + xDist, objPlayer.y + yDist - ((rayGoesUp)? TILE_SIZE:0), objPlayer.level);

        return [xDist, yDist, getDistFromSidelength(xDist, yDist), collision];
    }

    render() {
        stroke('rgba(0,200,255,0.3)');
        strokeWeight(1);
        line(cMAP_SCALING * objPlayer.x,
            cMAP_SCALING * objPlayer.y,
            cMAP_SCALING * (objPlayer.x + this.dX),
            cMAP_SCALING * (objPlayer.y + this.dY)
        );
    }
}

class FieldOfView {
    constructor(oAngleView) {
        this.angleView = oAngleView;
        this.fovSpeed = 2 * Math.PI / 180;
        this.turnDirection = 0; // -1 == left, 1 == right

        this.rays = [];
        this.maxDistance = Math.max(objMap.width, objMap.height) * TILE_SIZE;
        this.maxDistance = Math.sqrt(2*this.maxDistance*this.maxDistance);   // hacemos el cuadrado y luego la raiz cuadrada (hipotenusa de pitagoras)
    }

    update() {
        this.angleView += this.turnDirection * this.fovSpeed;
        this.angleView = normalizeAngle(this.angleView);

        this.castFOVRays();
    }

    castFOVRays() {
        this.rays = [];

        let rayAngle = this.angleView - cFOV/2;
        for (let iRay = 0; iRay < cFOV_NUM_RAYS; iRay++) {
            let auxRay = new Ray(normalizeAngle(rayAngle));
            auxRay.cast();
            this.rays.push(auxRay);
            rayAngle += cFOV_ANGLE_SPACING;
        }
    }

    render() {
        // Player main angle view render - - - - - - - - - - - - - - - - - - 
        /*
        stroke(0,200,255);
        strokeWeight(1);
        line(cMAP_SCALING * objPlayer.x,
            cMAP_SCALING * objPlayer.y,
            cMAP_SCALING * (objPlayer.x + 50 * Math.cos(this.angleView)),
            cMAP_SCALING * (objPlayer.y + 50 * Math.sin(this.angleView))
        );
        */

        // FOV rays main angle view render - - - - - - - - - - - - - - - - - - 
        for (let iRay=0; iRay < cFOV_NUM_RAYS; iRay++) this.rays[iRay].render();
    }
}

class Player {
    constructor(oX, oY, oLevel, oAngleView) {
        this.level = oLevel - 1;
        this.x = oX;
        this.y = oY;
        this.fov = new FieldOfView(oAngleView);
        
        this.movSpeed = 2;          // el jugador avanza 2 px/frame
        this.walkDirection = 0;     // -1 == back, 1 == front
        this.flankDirection = 0;    // -1 == left, 1 == right

        this.fisheyeEffect = false;
    }

    update() {
        // actualizamos la posicion del jugador
        this.movePlayer()
        // actualizamos los rayos del fov del jugador (posicion, etc.)
        this.fov.update();
    }

    movePlayer() {
        // caminar: avanzar / retroceder _____________________________________________________ (1)
        let dx = this.x + this.walkDirection * this.movSpeed * Math.cos(this.fov.angleView);
        let dy = this.y + this.walkDirection * this.movSpeed * Math.sin(this.fov.angleView);
        // tratamos X e Y por separado: el jugador tal vez no pueda moverse en X pero si en Y.
        if (!objMap.hasWallAtX(dx, this.y, this.level)) this.x = dx;
        if (!objMap.hasWallAtY(this.x, dy, this.level)) this.y = dy;

        // flanquear: caminar hacia la izquierda / derecha ___________________________________ (2)
        dx = this.x + this.flankDirection * this.movSpeed * Math.cos(this.fov.angleView + Math.PI/2);
        dy = this.y + this.flankDirection * this.movSpeed * Math.sin(this.fov.angleView + Math.PI/2);
        // tratamos X e Y por separado: el jugador tal vez no pueda moverse en X pero si en Y.
        if (!objMap.hasWallAtX(dx, this.y, this.level)) this.x = dx;
        if (!objMap.hasWallAtY(this.x, dy, this.level)) this.y = dy;
    }

    render() {
        this.fov.render();
        
        noStroke();
        fill(0,200,255,255);
        circle(cMAP_SCALING * this.x,
            cMAP_SCALING * this.y,
            cMAP_SCALING * 6);
        
    }
}