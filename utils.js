// fps counter
var fpsLastCalledTime;
var fps;
var maxFps, minFps;

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle = (2 * Math.PI) + angle;  // para que permanezca entre 0 y 2 PI
    }
    return angle;
}

function degreesToRadians(angle) {
    return angle * Math.PI/180;
}

function radiansToDegrees(angle) {
    return angle / Math.PI*180;
}


function getDistFromCoordinates(oX, oY, dX, dY) {
    return Math.sqrt((dX-oX)*(dX-oX) + (dY-oY)*(dY-oY));
}

function getDistFromSidelength(dX, dY) {
    return Math.sqrt(dX*dX + dY*dY);
}

function countFPS() {
    if(!fpsLastCalledTime) {
        fpsLastCalledTime = Date.now();
        fps = 0;
        return '-';
    }
    delta = (Date.now() - fpsLastCalledTime)/1000;
    fpsLastCalledTime = Date.now();
    fps = 1/delta;
    fps = Math.floor(fps);

    if (fps > maxFps) maxFps = fps;
    if (fps < minFps) minFps = fps;
}

function drawFPS() {
    textSize(TILE_SIZE/2);
    fill(55,55,55);
    text(
        'Max: '+maxFps+' fps',
        VIEWPORT_WIDTH - TILE_SIZE*4,
        TILE_SIZE
    );
    text(
        'Min: '+minFps+' fps',
        VIEWPORT_WIDTH - TILE_SIZE*4,
        1.6*TILE_SIZE
    );

    fill(100,100,100);
    text(
        'Current: '+fps+' fps',
        VIEWPORT_WIDTH - TILE_SIZE*4,
        2.5*TILE_SIZE
    );
}

function reloadFPS() {
    maxFps = 0;
    minFps = 999;
}