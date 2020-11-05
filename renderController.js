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

const RENDER_VLINE_SHADOW_EFFECT = .7;

class VLine {
    constructor(index, height, offset, tempColor) {
        this.index = index;
        this.height = height;
        this.offset = offset;
        this.textureRects = [];
        this.stepRects = height;
        this.nRects = 1;
        this.tempColor = tempColor;
    }

    getTexelColumn() {
        let dTexelColumn = 0;
        if (objPlayer.fov.rays[this.index].rayHitsVertically) {
            dTexelColumn = (objPlayer.x + objPlayer.fov.rays[this.index].dX) % TILE_SIZE;
            if (objPlayer.fov.rays[this.index].dY > 0) dTexelColumn = TILE_SIZE - dTexelColumn;
        } else {
            dTexelColumn = (objPlayer.y + objPlayer.fov.rays[this.index].dY) % TILE_SIZE;
            if (objPlayer.fov.rays[this.index].dX < 0) dTexelColumn = TILE_SIZE - dTexelColumn;
        }
        // mapeamos el valor de la columna resultante a las dimensiones de la textura
        // (por ejemplo, si es de 16x16, la 'dTexelColumn' 32 será la 16, la 'dTexelColumn' 16 será la columna 8...) 
        if (dTexelColumn < 0) dTexelColumn = 0;
        if (dTexelColumn > TILE_SIZE) dTexelColumn = TILE_SIZE;
        dTexelColumn = map(dTexelColumn, 0, TILE_SIZE, 0, imageLoader.imagesTexture[0].width);

        // redondeamos para definir la columna exacta de pixeles de la textura a cargar
        dTexelColumn = Math.floor(dTexelColumn);
        
        return dTexelColumn;
    }

    getTextureColor(yRect, texelColumn) {
        // en funcion del muro contra que impacte, que cargue una textura diferente (si existe)
        // "devuelveme de la primera fila de pixeles, el color que corresponde a mi texel column"
        let pixel = imageLoader.imagesTexture[objPlayer.fov.rays[this.index].rayImpactsOn - 1].pixels[0][texelColumn];
        let newColor = color(pixel.levels[0], pixel.levels[1], pixel.levels[2], pixel.levels[3]);
        if (!this.index) console.log('Antes:'+newColor.levels[0]);
        if (objPlayer.fov.rays[this.index].rayHitsVertically) {
            newColor.levels[0] *= RENDER_VLINE_SHADOW_EFFECT;
            newColor.levels[1] *= RENDER_VLINE_SHADOW_EFFECT;
            newColor.levels[2] *= RENDER_VLINE_SHADOW_EFFECT;
        }
        if (!this.index) console.log('Despu:'+newColor.levels[0]);

        return newColor;
    }

    render(horizon, texelColumn) {
        // primero casteamos un color de fondo, por si la imagen falla
        /*
        fill(this.tempColor);
        rect(
            cRENDER_VLINES_SCALING * (this.index * cRENDER_VLINES_WIDTH),
            horizon * VIEWPORT_HEIGHT - this.offset,
            cRENDER_VLINES_WIDTH+.5,
            this.height
        );
        */
        // ahora cargamos los rectangulos que corresponden a las textura
        for (let yRect=0; yRect<this.nRects; yRect++) {
            fill(this.getTextureColor(yRect, texelColumn));
            rect(
                cRENDER_VLINES_SCALING * (this.index * cRENDER_VLINES_WIDTH),
                horizon * VIEWPORT_HEIGHT - this.offset,
                cRENDER_VLINES_WIDTH,
                this.height
            );
        }
    }
}

class Render {
    constructor() {
        this.horizonThreshold = 3/5;    // el umbral del horizonte esta a 1/3 de distancia de la base
        this.vLines = [];
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
            answer *= RENDER_VLINE_SHADOW_EFFECT;
        }
        if (objPlayer.fov.rays[i].rayImpactsOn == 2)
            return color(0, answer, 0);
        return color(answer, answer, answer);
    }

    loadProjection() {
        strokeWeight(0);
        
        for (let iVLine = 0; iVLine < cFOV_NUM_RAYS; iVLine++) {
            let texelColumn = this.vLines[iVLine].getTexelColumn();
            this.vLines[iVLine].render(this.horizonThreshold, texelColumn);
        }
    }
}