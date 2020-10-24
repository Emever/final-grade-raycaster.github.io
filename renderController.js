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

class Render {
    constructor() {
        this.horizonThreshold = 3/5;    // el umbral del horizonte esta a 1/3 de distancia de la base
        this.vLinesHeight = [];
        this.vLinesOffset = [];

        this.vLinesAlpha = [];
    }

    update() {
        this.vLinesHeight = [];
        this.vLinesOffset = [];
        this.vLinesAlpha = [];

        for (let iRay = 0; iRay < FOV_NUM_RAYS; iRay++) {
            this.vLinesAlpha.push(this.calculateVLineAlpha(iRay));
            this.vLinesHeight.push(this.calculateVLineHeight(iRay));
            this.vLinesOffset.push(this.vLinesHeight[iRay]/2);
        }
    }

    calculateVLineHeight(i) {
        let distToProjectionPlane = VIEWPORT_WIDTH/2 / Math.tan(FOV/2);
        let height = (TILE_SIZE / objPlayer.fov.rays[i].distance) * distToProjectionPlane;
        return height;
    }

    calculateVLineAlpha(i) {
        let answer = 255 - objPlayer.fov.rays[i].distance * 255/objPlayer.fov.maxDistance;
        if (objPlayer.fov.rays[i].rayHitsVertically) answer *= 0.9;
        return answer;
    }

    loadProjection() {
        strokeWeight(0);
        
        for (let iVLine = 0; iVLine < FOV_NUM_RAYS; iVLine++) {
            fill(this.vLinesAlpha[iVLine], this.vLinesAlpha[iVLine], this.vLinesAlpha[iVLine]);
            rect(
                RENDER_VLINES_SCALING * (iVLine * RENDER_VLINES_WIDTH),
                this.horizonThreshold * VIEWPORT_HEIGHT - this.vLinesOffset[iVLine],
                RENDER_VLINES_WIDTH,
                this.vLinesHeight[iVLine]
            );
        }
    }
}