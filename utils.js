function levelImageToGrid(className) {
    var grid = [];

    var myImage = new Image();   // Create new img element
    myImage.src = 'img/level-01.png'; // Set source path

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    //var img = document.getElementById("level-01");
    ctx.drawImage(myImage, 0, 0);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i + 1] = 255 - imgData.data[i + 1];
        imgData.data[i + 2] = 255 - imgData.data[i + 2];
        imgData.data[i + 3] = 255;
    }

    // Get the image data
    console.log(imgData);
}

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

function getDistFromCoordinates(oX, oY, dX, dY) {
    return Math.sqrt((dX-oX)*(dX-oX) + (dY-oY)*(dY-oY));
}

function getDistFromSidelength(dX, dY) {
    return Math.sqrt(dX*dX + dY*dY);
}