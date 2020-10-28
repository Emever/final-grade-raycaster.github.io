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

// si anadimos mas imagenes al proyecto, debemos agregarlas a esta constante para ser leidas
const IMG_LIST = [
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
        for (var iImg = 0; iImg < IMG_LIST.length; iImg++) {
            let url = 'img/' + IMG_LIST[iImg];

            // (1) guardar tanta info de la imagen como sea posible antes de leerla
            this.images.push(
                {
                    index:  iImg,
                    data:    null,  // aun no podemos acceder a la imagen
                    pixels:   [],   // aun no podemos acceder al array de pixeles
                    function: "",   // un mapa, un enemigo, una textura...
                    path:   url,
                    height: 16,
                    width:  16
                }
            );

            this.images[iImg].data = loadImage(url);
            //console.log(this.images[iImg].data);

            if (this.images[iImg].path.includes('map')) this.images[iImg].function = "mapgrid";
            else if (this.images[iImg].path.includes('texture')) this.images[iImg].function = "texture";
            else if (this.images[iImg].path.includes('ground')) this.images[iImg].function = "ground";
            else if (this.images[iImg].path.includes('sky')) this.images[iImg].function = "sky";

        }
    }

    loadImagesPixels() {
        // por cada imagen que haya en la lista:
        for (let i=0; i < this.images.length; i++) {
            let img = this.images[i];
            
            // (1) cargamos la informacion que falta en this.images
            img.width = img.data.width;
            img.height = img.data.height;

            // (2) preparamos el canvas para renderizar la imagen
            this.canvas.style = "none";
            this.ctx.imageSmoothingEnabled = false;
            
            this.canvas.width = img.width;
            this.canvas.height = img.height;

            // (3) cargamos la imagen y obtenemos el array de informacion
            image(img.data, 0, 0);
            let data = this.ctx.getImageData(0, 0, img.width, img.height);
            this.dataToPixelArray(i, data.data);
            
        }
        //this.consoleLogging();
    }

    dataToPixelArray(imageIndex, data) {
        let valueIndex = 0;
        let image = this.images[imageIndex];
        // array contiene los valores R,G,B,A en serie (4 valores que se repiten)
        
        let auxArray = [];  // para montar una matriz bidimensional -> array auxiliar para cada fila
        for (let y=0; y<image.height; y++) {
            auxArray = [];

            for (let x=0; x<image.width; x++) { // anadimos el color del pixel en la matriz
                 
                // si la imagen es para cargar el mapa, debemos aproximar los colores; sino no es necesario
                if (this.images[imageIndex].function == "mapgrid")
                    auxArray.push(this.getAproxColor([data[valueIndex + 0], data[valueIndex + 1], data[valueIndex + 2], data[valueIndex + 3]]));
                else
                    auxArray.push(color(data[valueIndex + 0], data[valueIndex + 1], data[valueIndex + 2], data[valueIndex + 3]));

                valueIndex += 4;
            }
            
            image.pixels.push(auxArray);
        }
    }

    getAproxColor(valuesArray) {
        let newValues = []; // nuevos valores
        // por cada valor, buscamos su aproximacion
        for(let iValue = 0; iValue<valuesArray.length; iValue++) {
            let aux = valuesArray[iValue];
            if (aux < 25) newValues.push(0);
            else if (aux >= 25 && aux < 50) newValues.push(25);
            else if (aux >= 50 && aux < 75) newValues.push(50);
            else if (aux >= 75 && aux < 100) newValues.push(75);
            else if (aux >= 100 && aux < 125) newValues.push(100);
            else if (aux >= 125 && aux < 150) newValues.push(125);
            else if (aux >= 150 && aux < 175) newValues.push(150);
            else if (aux >= 175 && aux < 200) newValues.push(175);
            else if (aux >= 200 && aux < 225) newValues.push(200);
            else if (aux >= 225 && aux <= 255) newValues.push(255);
        }

        return color(newValues[0], newValues[1], newValues[2], newValues[3]); 
    }

    consoleLogging() {
        for (let iImg = 0; iImg < this.images.length; iImg++) {
            console.log(this.images[iImg]);
        }
    }
}