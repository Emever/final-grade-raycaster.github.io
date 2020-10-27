/*
    nombre: imageLoader.js
    descripcion: clase encargada de leer las imagenes del proyecto y generar las matrices de pixeles

    funciones:
        - inicializar todas las imagenes del proyecto en precarga
    
    goals:
        o obtener un array con todas las imagenes   [x]
        o funciones para obtener info optimamente   [ ]
    
    estado:
        > en proceso...
*/

const IMG_NAMES = [
    "map_level01_01.png",
    "map_level01_02.png",
    "map_level01_03.png",
    "map_level02_01.png"
];

class ImageLoader {
    constructor() {
        //console.log("Llamada al constructor de ImageLoader.");
        this.images = [];
        createCanvas(16, 16);
        this.canvas = document.getElementsByClassName('p5Canvas')[0];
        this.ctx = this.canvas.getContext('2d');
    }

    init() {
        // inicializamos la info basica del canvas y los accesos
        this.canvas.style = "none";
        this.ctx.imageSmoothingEnabled = false;

        // (0) por cada imagen del array:
        for (let iImg = 0; iImg < IMG_NAMES.length; iImg++) {
            // (1) cargar la imagen
            loadImage('img/' + IMG_NAMES[iImg], img => {
                
                // (2) guardar la info basica en el array images de la clase
                this.images.push(
                    {
                        data:    null,  // aun no podemos acceder a la imagen
                        pixels:   [],   // aun no podemos acceder al array de pixeles
                        function: "",   // un mapa, un enemigo, una textura...
                        path:   'img/' + IMG_NAMES[iImg],
                        height: img.height,
                        width:  img.width
                    }
                );
                this.images[iImg].data = img;
                if (IMG_NAMES[iImg].includes('map')) this.images[iImg].function = "mapgrid";
                else if (IMG_NAMES[iImg].includes('texture')) this.images[iImg].function = "texture";
                else if (IMG_NAMES[iImg].includes('ground')) this.images[iImg].function = "ground";
                else if (IMG_NAMES[iImg].includes('sky')) this.images[iImg].function = "sky";
            });
        }
    }

    loadImagesPixels() {
        // por cada imagen que haya en la lista:
        for (let i=0; i < this.images.length; i++) {
            let img = this.images[i];
            
            // (1) preparamos el canvas para renderizar la imagen
            this.canvas.style = "none";
            this.ctx.imageSmoothingEnabled = false;

            this.canvas.width = img.width;
            this.canvas.height = img.height;
            // (2) cargamos la imagen y obtenemos el array de informacion
            image(img.data, 0, 0);
            let data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.dataToPixelArray(i, data.data);
            
        }
        //this.consoleLogging();
    }

    dataToPixelArray(imageIndex, data) {
        let xPos = 0;
        let yPos = 0;
        let valueIndex = 0;
        let image = this.images[imageIndex];
        // array contiene los valores R,G,B,A en serie (4 valores que se repiten)
        
        let auxArray = [];  // para montar una matriz bidimensional -> array auxiliar para cada fila
        for (let y=0; y<image.height; y++) {
            auxArray = [];

            for (let x=0; x<image.width; x++) {
                // anadimos el color del pixel en la matriz
                auxArray.push(color(data[valueIndex + 0], data[valueIndex + 1], data[valueIndex + 2], data[valueIndex + 3]));
                valueIndex += 4;
            }
            
            image.pixels.push(auxArray);
        }
    }

    consoleLogging() {
        for (let iImg = 0; iImg < this.images.length; iImg++) {
            console.log(this.images[iImg]);
        }
    }
}