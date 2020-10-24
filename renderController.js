/*
    nombre: renderController.js
    descripcion: clase encargada de renderizar las proyecciones de los rayos en lineas verticales (efecto 3D)

    funciones:
        - renderizar los muros de la simulacion
    
    goals:
        o renderizar algo por pantalla      [ ]
        o cargar texturas para los muros    [ ]
        o renderizar los muros con texturas [ ]
        o suelo y cielo personalizados      [ ]
    
    estado:
        > en proceso...
*/

const VIEWPORT_WIDTH = 960;
const VIEWPORT_HEIGHT = 640;
const RENDER_VLINES_SCALING = 1;
const RENDER_VLINES_WIDTH = VIEWPORT_WIDTH / FOV_NUM_RAYS / RENDER_VLINES_SCALING;
const RENDER_VLINES_MIN_HEIGHT = VIEWPORT_HEIGHT/10;
const RENDER_VLINES_MAX_HEIGHT = VIEWPORT_HEIGHT;

class Render {
    constructor() {
        this.horizonThreshold = 2/3;    // el umbral del horizonte esta a 1/3 de distancia de la base
        this.vLinesHeight = [];
        this.vLinesOffset = [];
    }

    update() {
        this.vLinesHeight = [];
        this.vLinesOffset = [];

        for (let iRay = 0; iRay < FOV_NUM_RAYS; iRay++) {
            this.vLinesHeight.push(2000/objPlayer.fov.rays[iRay].distance);
            this.vLinesOffset.push(this.vLinesHeight[iRay]/2);
            if (!iRay) console.log("Offset: "+this.vLinesOffset[iRay] + "\t| Height: " + this.vLinesHeight[iRay] + ".");
        }
    }

    loadProjection() {
        fill(255,255,255);
        strokeWeight(0);
        
        for (let iVLine = 0; iVLine < FOV_NUM_RAYS; iVLine++) {
            rect(
                RENDER_VLINES_SCALING * (iVLine * RENDER_VLINES_WIDTH),
                this.horizonThreshold * VIEWPORT_HEIGHT - this.vLinesOffset[iVLine],
                RENDER_VLINES_WIDTH + 1,
                this.vLinesHeight[iVLine]
            );

        }
    }
}