/*
    nombre: sliderController.js
    descripcion: variables globales y funciones que gestionan el valor de los sliders

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

// global custom constant variables
var cFOV, cFOV_NUM_RAYS, cFOV_ANGLE_SPACING;        // del PlayerController
var cRENDER_VLINES_SCALING, cRENDER_VLINES_WIDTH;   // del RenderController
var cMAP_SCALING;                                   // del MapController

// variables de los sliders
var cFOVslider, cFOV_NUM_RAYSslider/*, cFOV_ANGLE_SPACING*/;        // del PlayerController
/*var cRENDER_VLINES_SCALING, cRENDER_VLINES_WIDTH;*/   // del RenderController
var cMAP_SCALINGslider;                                   // del MapController
var cFLOOR_NUM_HLINES;


function initCustomConst() {
    cFOV = FOV;
    cFOV_NUM_RAYS = FOV_NUM_RAYS;
    cFOV_ANGLE_SPACING = FOV_ANGLE_SPACING;
    cRENDER_VLINES_SCALING = RENDER_VLINES_SCALING;
    cRENDER_VLINES_WIDTH = RENDER_VLINES_WIDTH;
    cMAP_SCALING = MAP_SCALING;

    cFOVslider = document.getElementById('FOV_Slider');
    document.getElementById('cFOV_value').textContent = radiansToDegrees(cFOV);
    cFOVslider.value = radiansToDegrees(cFOV);

    cFOV_NUM_RAYSslider = document.getElementById('FOV_NUM_RAYS_Slider');
    document.getElementById('cFOV_NUM_RAYS_value').textContent = cFOV_NUM_RAYS;
    cFOV_NUM_RAYSslider.value = cFOV_NUM_RAYS;

    cMAP_SCALINGslider = document.getElementById('MAP_SCALING_Slider');
    document.getElementById('cMAP_SCALING_value').textContent = cMAP_SCALING;
    cMAP_SCALINGslider.value = cMAP_SCALING;
}

function initSliders() {
    cFOVslider.oninput = () => {
        cFOV = degreesToRadians(cFOVslider.value);
        // al cambiar el angulo de FOV, tambien cambia el espaciado entre los rayos
        cFOV_ANGLE_SPACING = cFOV / (cFOV_NUM_RAYS - 1);
        // y, por tanto, el ancho de cada vLine (proyeccion en altura del rayo)
        cRENDER_VLINES_WIDTH = VIEWPORT_WIDTH / cFOV_NUM_RAYS;
        document.getElementById('cFOV_value').textContent = cFOVslider.value;
    };

    cFOV_NUM_RAYSslider.oninput = () => {
        cFOV_NUM_RAYS = cFOV_NUM_RAYSslider.value;
        // al cambiar el numero de rayos del FOV, cambia su espaciado
        cFOV_ANGLE_SPACING = cFOV / (cFOV_NUM_RAYS - 1);
        // y tambien el ancho de cada vLine
        cRENDER_VLINES_WIDTH = VIEWPORT_WIDTH / cFOV_NUM_RAYS;
        document.getElementById('cFOV_NUM_RAYS_value').textContent = cFOV_NUM_RAYSslider.value;

    };

    cMAP_SCALINGslider.oninput = () => {
        cMAP_SCALING = cMAP_SCALINGslider.value;
        document.getElementById('cMAP_SCALING_value').textContent = cMAP_SCALINGslider.value;
    };
}