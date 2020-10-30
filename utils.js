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