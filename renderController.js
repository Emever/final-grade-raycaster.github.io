/*
    nombre: renderController.js
    descripcion: clases encargadas de renderizar las proyecciones de los rayos en lineas verticales (efecto 3D)

    funciones:
        - renderizar los muros de la simulacion
    
    goals:
        o renderizar algo por pantalla      [x]
        o cargar texturas para los muros    [x]
        o renderizar los muros con texturas [x]
        o pintar suelo y cielo              [x]
    
    estado:
        > terminado
*/

const VIEWPORT_WIDTH = 640; //before: (960,640)
const VIEWPORT_HEIGHT = 480;
const RENDER_VLINES_SCALING = 1;
const RENDER_VLINES_WIDTH = VIEWPORT_WIDTH / FOV_NUM_RAYS / RENDER_VLINES_SCALING;

const FLOOR_NUM_HLINES = 640/30;    // pick a number
const CEILING_NUM_HLINES = 640/20;    // pick a number

const RENDER_VLINE_SHADOW_EFFECT = .7;

class VLine {
    constructor(index, height, offset, tempColor) {
        this.index = index; // equivale al indice del rayo de la fov del jugador
        this.height = height;
        this.offset = offset;
        this.tempColor = tempColor;
        
        this.texelColumn = 0;
        this.textureRects = [];
        this.rectStep = 0;
    }

    setTexelColumn() {
        if (objPlayer.fov.rays[this.index].rayHitsVertically) {
            this.texelColumn = (objPlayer.x + objPlayer.fov.rays[this.index].dX) % TILE_SIZE;
            if (objPlayer.fov.rays[this.index].dY > 0) this.texelColumn = TILE_SIZE - this.texelColumn;
        } else {
            this.texelColumn = (objPlayer.y + objPlayer.fov.rays[this.index].dY) % TILE_SIZE;
            if (objPlayer.fov.rays[this.index].dX < 0) this.texelColumn = TILE_SIZE - this.texelColumn;
        }
        // mapeamos el valor de la columna resultante a las dimensiones de la textura que estamos cargando
        // (por ejemplo, si es de 16x16, la 'dTexelColumn' 32 será la 16, la 'dTexelColumn' 16 será la columna 8...) 
        if (this.texelColumn < 0) this.texelColumn = 0;
        if (this.texelColumn > TILE_SIZE) this.texelColumn = TILE_SIZE;
        this.texelColumn = map(this.texelColumn, 0, TILE_SIZE, 0, imageLoader.imagesTexture[(objPlayer.fov.rays[this.index].rayImpactsOn - 1)].width);

        // redondeamos para definir la columna exacta de pixeles de la textura a cargar
        this.texelColumn = Math.floor(this.texelColumn);
    }

    setRectangleTexturing() {
        // el numero de rectangulos en que dividiremos la vLine a colorear depende de los pixeles de altura de la textura
        let nRects = imageLoader.imagesTexture[(objPlayer.fov.rays[this.index].rayImpactsOn - 1)].height;
        this.rectStep = this.height / nRects;
        this.textureRects = [];
        for (let iRect=0; iRect < nRects; iRect++) {
            let pixel = imageLoader.imagesTexture[(objPlayer.fov.rays[this.index].rayImpactsOn - 1)].pixels[iRect][this.texelColumn];
            let newColor = color(pixel.levels[0], pixel.levels[1], pixel.levels[2], pixel.levels[3]);
            if (objPlayer.fov.rays[this.index].rayHitsVertically) {
                newColor.levels[0] *= RENDER_VLINE_SHADOW_EFFECT;
                newColor.levels[1] *= RENDER_VLINE_SHADOW_EFFECT;
                newColor.levels[2] *= RENDER_VLINE_SHADOW_EFFECT;
            }
            //newColor.levels[3] = map(objPlayer.fov.rays[this.index].distance, 0, 2*TILE_SIZE, 255, 0, true);
            this.textureRects.push(newColor);
        }
    }

    getTextureColor(yRect) {
        // en funcion del muro contra que impacte, que cargue una textura diferente (si existe)
        // "devuelveme de la primera fila de pixeles, el color que corresponde a mi texel column"
        let pixel = imageLoader.imagesTexture[objPlayer.fov.rays[this.index].rayImpactsOn - 1].pixels[0][this.texelColumn];
        let newColor = color(pixel.levels[0], pixel.levels[1], pixel.levels[2], pixel.levels[3]);
        if (objPlayer.fov.rays[this.index].rayHitsVertically) {
            newColor.levels[0] *= RENDER_VLINE_SHADOW_EFFECT;
            newColor.levels[1] *= RENDER_VLINE_SHADOW_EFFECT;
            newColor.levels[2] *= RENDER_VLINE_SHADOW_EFFECT;
        }

        return newColor;
    }

    render(horizon) {
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
        for (let yRect=0; yRect<this.textureRects.length; yRect++) {
            fill(this.textureRects[yRect]);
            rect(
                cRENDER_VLINES_SCALING * (this.index * cRENDER_VLINES_WIDTH),
                horizon * (VIEWPORT_HEIGHT + yRect*this.rectStep - this.offset),
                cRENDER_VLINES_WIDTH,
                this.rectStep
            );
        }
    }
}

class Render {
    constructor() {
        this.horizonThreshold = 3/5;    // el umbral del horizonte esta a 1/3 de distancia de la base
        this.vLines = [];
        this.floorGradient = [];
        this.floorHLinesSpacing = 0;
        this.ceilingGradient = [];
        this.ceilingHLinesSpacing = 0;
    }

    update() {
        this.vLines = [];

        for (let iRay = 0; iRay < cFOV_NUM_RAYS; iRay++) {
            let auxHeight = this.calculateVLineHeight(iRay);

            //let vLine = new VLine(iRay, auxHeight, auxHeight/2, this.calculateVLineColor(iRay));
            let vLine = new VLine(iRay, auxHeight, auxHeight/2, 'white');
            vLine.setTexelColumn();
            vLine.setRectangleTexturing();

            this.vLines.push(vLine);
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
        
        for (let iVLine = 0; iVLine < cFOV_NUM_RAYS; iVLine++) {
            this.vLines[iVLine].render(this.horizonThreshold);
        }
    }

    setFloor() {
        let c1 = color("#18b542");
        let c2 = color("#03290d");
        this.floorHLinesSpacing = VIEWPORT_HEIGHT*(1-this.horizonThreshold) / FLOOR_NUM_HLINES;
        this.floorGradient = [];
        for (let i=0; i<FLOOR_NUM_HLINES; i++) {
            let interpolation = map(i, 0, FLOOR_NUM_HLINES, 0, 1);
            
            this.floorGradient.push(lerpColor(c1,c2,interpolation));
        }
    }

    setCeiling() {
        let c1 = color("#4aeaff");
        let c2 = color("#b0f6ff");
        this.ceilingHLinesSpacing = VIEWPORT_HEIGHT*(this.horizonThreshold) / CEILING_NUM_HLINES;
        this.ceilingGradient = [];
        for (let i=0; i<CEILING_NUM_HLINES; i++) {
            let interpolation = map(i,0,CEILING_NUM_HLINES,0,1);
            this.ceilingGradient.push(lerpColor(c1,c2,interpolation));
        }
    }

    renderFloor() {
        for (let i=0; i<FLOOR_NUM_HLINES; i++) {
            fill(this.floorGradient[i]);
            rect(
                0,
                VIEWPORT_HEIGHT - i*this.floorHLinesSpacing,
                VIEWPORT_WIDTH,
                this.floorHLinesSpacing
            );
        }
    }

    renderCeiling() {
        for (let i=0; i<CEILING_NUM_HLINES; i++) {
            fill(this.ceilingGradient[i]);
            rect(
                0,
                i*this.ceilingHLinesSpacing,
                VIEWPORT_WIDTH,
                this.ceilingHLinesSpacing
            );
        }
    }
}