/*
    nombre: mapController.js
    descripcion: clase encargada de gestionar todas las funciones y variables relacionadas con el mapa del raycaster

    funciones:
        - inicializar tanta informacion como sea posible sobre el mapa del raycaster
        - mantener una lista util y accesible de datos para facilitar el uso de variables
        - gestionar automaticamente la visibilidad del jugador, su campo de vision y el mapa en tiempo real
    
    goals:
        o primer render en pantalla sobre el mapa   [x]
        o cargar la información desde una imagen    [ ]
        o tener una lista con todos los muros       [x]
    
    estado:
        > congelado en cargar info desde una imagen.
*/

const MAP_SCALING = .5;    //factor de reescalado del mapa (utilidad como minimapa)
const TILE_SIZE = 32;   //32 pixeles cuadrados cada tile del mapa

class Map {
    constructor() {
        this.grid = [
            [   // level 1
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // row 1
                [1, 0, 1, 1, 0, 0, 0, 0, 0, 1], // row 2...
                [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            [   // level 2
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // row 1
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 2...
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]
        ];
        //levelImageToGrid('level-map-image-grid'); //TODO: LECTOR DE MAPAS DESDE UNA IMAGEN
        this.nLevels = this.grid.length;
        this.height = this.grid[0].length;
        this.width = this.grid[0][0].length;

        // array con todas las tiles
        this.tileset = [];
        // array con las tiles de clase "muro" ("wall")
        this.walls = [];

        this.init();
    }

    loadTileset() {
        var totalIndex = 0;
        for (let iLevel=0; iLevel<this.nLevels; iLevel++) {
            for (let iRow=0; iRow<this.height; iRow++) {
                for (let iCol=0; iCol<this.width; iCol++) {
                    this.tileset.push(new Tile(totalIndex, iLevel, iCol, iRow, (this.grid[iLevel][iRow][iCol])? "wall":"none"));
                    totalIndex++;
                }
            }
        }
    }

    loadWallset() {
        var i=0;
        while (i<this.tileset.length) {
            if (this.tileset[i].class == "wall") {
                this.walls.push(this.tileset[i]);
            }
            i++;
        }
    }

    // carga las variables adicionales al mapa tras el constructor
    init() {
        this.loadTileset();
        this.loadWallset();
    }

    // busca si las coordenadas en parametros las ocupa un muro
    hasWallAtX(dx, dy, dlevel) {
        if (dx < 0 || dx > this.width * TILE_SIZE) return true;
        //calculamos la tile de la grid donde se encontrara el jugador
        return (this.grid[dlevel][Math.floor(dy/TILE_SIZE)][Math.floor(dx/TILE_SIZE)]);
    }
    hasWallAtY(dx, dy, dlevel) {
        if (dy < 0 || dy > this.height * TILE_SIZE) return true;
        //calculamos la tile de la grid donde se encontrara el jugador
        return (this.grid[dlevel][Math.floor(dy/TILE_SIZE)][Math.floor(dx/TILE_SIZE)]);
    }
    hasWallAt(dx, dy, dlevel) {
        if ((dy < 0 || dy > this.height * TILE_SIZE) || (dx < 0 || dx > this.width * TILE_SIZE)) return true;
        //calculamos la tile de la grid donde se encontrara el jugador
        return (this.grid[dlevel][Math.floor(dy/TILE_SIZE)][Math.floor(dx/TILE_SIZE)]);
    }


    //chivato del mapa
    consoleLogging() {
        var logChar = "";
        for (let iLevel=0; iLevel<this.nLevels; iLevel++) {
            for (let iRow=0; iRow<this.height; iRow++) {
                for (let iCol=0; iCol<this.width; iCol++) {
                    logChar = logChar + this.grid[iLevel][iRow][iCol];
                }
                logChar = logChar + "\n";
            }
            logChar = logChar + "\n";
        }
        console.log(logChar);
        //console.log(this);
        console.log("En total hay "+this.walls.length+" muros.");
    }

    // mostrar visual del mapa
    render() {
        // fondo del minimapa
        fill(0, 0, 0, 125);
        rect(
            0,
            0,
            MAP_SCALING * this.width * TILE_SIZE,
            MAP_SCALING * this.height * TILE_SIZE
        );

        // info sobre el nivel mostrado
        textSize(TILE_SIZE/2);
        fill(0,200,255);
        text(
            'Level '+(objPlayer.level+1)+'/'+this.nLevels,
            MAP_SCALING * TILE_SIZE/2,
            MAP_SCALING * (this.height+1.5) * TILE_SIZE
        );

        // mostramos solo los muros del nivel
        var iTile=0;
        while (iTile < this.walls.length) {
            // TODO: POR AHORA ES 1, PERO MAS ADELANTE NECESITAREMOS CAMBIARLO POR EL NIVEL EN QUE SE ENCUENTRE EL JUGADOR
            let tile = this.walls[iTile];
            tile.render();
            iTile++;
        }
    }
    
}

// cada casilla del mapa
class Tile {
    constructor(index, level, xmap, ymap, type) {
        this.i = index;                 //indice total de la tile
        this.xMap = xmap;               //columna en el mapa
        this.yMap = ymap;               //fila en el mapa
        this.xPos = xmap * TILE_SIZE;   //coordenada x en el mapa (pixeles)
        this.YPos = ymap * TILE_SIZE;   //coordenada y en el mapa (pixeles)
        this.level = level;             //indice del nivel
        this.class = type;              //tipo de casilla (muro, nada, etc.)
    }

    render() {
        // pinta el muro de un color y none transparente
        strokeWeight(1);
        stroke(200,200,200);
        fill(200,200,200);
        if (objPlayer.level != this.level) {
            fill(200,200,200,25);
            strokeWeight(0);
        }

        rect(
            MAP_SCALING * this.xPos,
            MAP_SCALING * this.YPos,
            MAP_SCALING * TILE_SIZE,
            MAP_SCALING * TILE_SIZE
        );
    }
}