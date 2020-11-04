/*
    nombre: renderController.js
    descripcion: clases encargadas de renderizar las proyecciones de los rayos en lineas verticales (efecto 3D)

    funciones:
        - renderizar los muros de la simulacion
    
    goals:
        o renderizar algo por pantalla      [x]
        o cargar texturas para los muros    [x]
        o renderizar los muros con texturas [ ]
        o suelo y cielo personalizados      [ ]
    
    estado:
        > en proceso...
*/

const VIEWPORT_WIDTH = 960;
const VIEWPORT_HEIGHT = 640;
const RENDER_VLINES_SCALING = 1;
const RENDER_VLINES_WIDTH = VIEWPORT_WIDTH / FOV_NUM_RAYS / RENDER_VLINES_SCALING;


class VLine {
    constructor(index, height, offset, tempColor) {
        this.index = index;
        this.height = height;
        this.offset = offset;
        this.textureRects = [];
        this.stepRects = height;
        this.tempColor = tempColor;
    }
}

class Render {
    constructor() {
        this.horizonThreshold = 3/5;    // el umbral del horizonte esta a 1/3 de distancia de la base
        this.vLines = [];
        this.verticalShadowEffect = 0.8;    // multiplicador para sombrear el rayo cuando impacta veticalmente con la pared
    }

    update() {
        this.vLines = [];

        for (let iRay = 0; iRay < cFOV_NUM_RAYS; iRay++) {
            let auxHeight = this.calculateVLineHeight(iRay);
            this.vLines.push(new VLine(iRay, auxHeight, auxHeight/2, this.calculateVLineColor(iRay)));
        }
    }

    calculateVLineHeight(i) {
        let distToProjectionPlane = VIEWPORT_WIDTH/2 / Math.tan(cFOV/2);
        let height = (TILE_SIZE / objPlayer.fov.rays[i].distance) * distToProjectionPlane;
        return height;
    }

    calculateVLineColor(i) {
        let answer;
        answer = 255 - (objPlayer.fov.rays[i].distance * 255/objPlayer.fov.maxDistance);
        if (objPlayer.fov.rays[i].rayHitsVertically) {
            answer *= this.verticalShadowEffect;
        }
        if (objPlayer.fov.rays[i].rayImpactsOn == 2)
            return color(0, answer, 0);
        return color(answer, answer, answer);
    }

    loadProjection() {
        strokeWeight(1);
        
        for (let iVLine = 0; iVLine < cFOV_NUM_RAYS; iVLine++) {
            let vLine = this.vLines[iVLine];
            fill(vLine.tempColor);
            rect(
                cRENDER_VLINES_SCALING * (iVLine * cRENDER_VLINES_WIDTH),
                this.horizonThreshold * VIEWPORT_HEIGHT - vLine.offset,
                cRENDER_VLINES_WIDTH+.5,
                vLine.height
            );
        }
    }
}