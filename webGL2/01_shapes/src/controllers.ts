import config from "./config.js";
import geometry from "./geometry.js";
import { buildCircleVertexBuffer, renderShapeWithWebGL2 } from "./utils.js";
import { hexToRgbArray } from "./utils.js";
import objects from "./objects.js";

export function initializeControllers() {

    $('#width-in-pixels').html(String(config.width_in_pixels.toFixed(2)) + "px");
    $('#width-proportion').html(String((100 * config.width_in_pixels/window.innerWidth).toFixed(0)) + "%");

    $('#height-in-pixels').html(String(config.height_in_pixels.toFixed(2)) + "px");
    $('#height-proportion').html(String((100 * config.height_in_pixels/window.innerHeight).toFixed(0)) + "%");

    let devicePixelRelationController = document.getElementById("device-pixel-ratio") as HTMLInputElement;
    devicePixelRelationController.max = devicePixelRatio.toString();

    devicePixelRatio = 1.00;

    let devicePixelRelationValue = document.getElementById("device-pixel-ratio-value") as HTMLInputElement;
    devicePixelRelationValue.value = devicePixelRatio.toFixed(2).toString();

    // utils.showError("It's everything good.");

}

export let updateCanvasWidth = function(width?:number) {

    config.width_in_pixels = window.innerWidth * width/100; 

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

    //Update controls displayed value
    width = Number(width);
    $('#width-in-pixels').html(String(config.width_in_pixels.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");
}

export let updateCanvasHeight = function(height?:number) {

    config.height_in_pixels = window.innerHeight * height/100; 

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

        //Update controls displayed value
    $('#height-in-pixels').html(String(config.height_in_pixels.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%")

}

export let updateclipPositionX = function(new_clipPositionX:number) {

    config.clipPositionX = new_clipPositionX;

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

        //Update controls displayed value
        $('#origin-x-in-pixels').html(String((config.width_in_pixels/2 * new_clipPositionX).toFixed(2)) + "px");
        $('#origin-x-proportion').html(String((100/2 * new_clipPositionX).toFixed(0)) + "%");
}

export let updateclipPositionY = function(new_clipPositionY:number) {

    config.clipPositionY = new_clipPositionY;
    
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

    //Update controls displayed value
    $('#origin-y-in-pixels').html(String((config.height_in_pixels/2 * new_clipPositionY).toFixed(2)) + "px");
    $('#origin-y-proportion').html(String((100/2 * new_clipPositionY).toFixed(0)) + "%");    
}

export let updateScale = function(new_scale:number) {

    config.scale = new_scale;

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

    //Update controls displayed value
    $('#scale-display-value').html(String((config.scale).toFixed(0)) + "X");
}

export let updateTriangleVertexes = function(new_value, vertex_number, coordinate_number) {

    geometry.triangleVertices[vertex_number * 2 + coordinate_number] = new_value;

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
}

export let updateSquareVertexes = function(new_value, vertex_number, coordinate_number) {

    geometry.squareVertices[vertex_number * 2 + coordinate_number] = Number(new_value);

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
}

export let updateTriangleVertexColor = function(new_color : string, vertexNumber: number) {

    let rgbArray = (hexToRgbArray(new_color));

    geometry.rgbTriangleColors[0 + 3 * vertexNumber] = rgbArray[0];
    geometry.rgbTriangleColors[1 + 3 * vertexNumber] = rgbArray[1];
    geometry.rgbTriangleColors[2 + 3 * vertexNumber] = rgbArray[2];

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

}

export let updateSquareVertexColor = function(new_color : string, vertexNumber: number) {

    let rgbArray = (hexToRgbArray(new_color));

    geometry.squareColors[0 + 3 * vertexNumber] = rgbArray[0];
    geometry.squareColors[1 + 3 * vertexNumber] = rgbArray[1];
    geometry.squareColors[2 + 3 * vertexNumber] = rgbArray[2];

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

}

export let updateCircleCenter = function(new_value, coordinate) {

    config.circle_center[coordinate] = Number(new_value);

    config.shape = new objects.Shape(buildCircleVertexBuffer(), geometry.circleColors);

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
    
}

export let updateDevicePixelRatio = function(new_value) {

    devicePixelRatio = new_value;

    let devicePixelRationController = document.getElementById("device-pixel-ratio-value") as HTMLInputElement;
    devicePixelRationController.value = new_value.toString();

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

}

export let drawTriangle = function() {
    
    config.shape = new objects.Shape(geometry.triangleVertices, geometry.rgbTriangleColors);

    $(".vertices-control").css('display', 'none');
    $("#triangle-vertices").css('display', 'flex');

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

}

export let drawSquare = function() {

    config.shape = new objects.Shape(geometry.squareVertices, geometry.squareColors);

    $(".vertices-control").css('display', 'none');
    $("#square-vertices").css('display', 'flex');

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

}

export let drawPolygon = function() {

    config.shape = new objects.Shape(geometry.circleVertices, geometry.circleColors);

    $(".vertices-control").css('display', 'none');
    $("#polygon-vertices").css('display', 'flex');

    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);

}

$('#triangle-vertices').find('.vertex-coordinate').on('input', (event) => {

    let element = event.target as HTMLInputElement;
    
    let value = Number(element.value);
    let vertexNumber = Number(element.dataset.index);
    let vertexCoordinate = Number(element.dataset.coordinate);

    updateTriangleVertexes(value, vertexNumber, vertexCoordinate);

})

$('#square-vertices').find('.vertex-coordinate').on('input', (event) => {

    let element = event.target as HTMLInputElement;
    
    let value = Number(element.value);
    let vertexNumber = Number(element.dataset.index);
    let vertexCoordinate = Number(element.dataset.coordinate);

    updateSquareVertexes(value, vertexNumber, vertexCoordinate);

})

$('#triangle-vertices').find('.vertex-color').on('input', (event) => {

    let element = event.target as HTMLInputElement;
    let vertexIndex = element.dataset.index;
    updateTriangleVertexColor(element.value, Number(vertexIndex));

})

$('#square-vertices').find('.vertex-color').on('input', (event) => {

    let element = event.target as HTMLInputElement;
    
    let vertexIndex = element.dataset.index;
    updateSquareVertexColor(element.value, Number(vertexIndex));

})

$('.circle-center').on('input', (event) => {

    let element = event.target as HTMLInputElement;
    let coordinate = element.dataset.coordinate;
    updateCircleCenter(element.value, coordinate);

})


document.getElementById("canvas-width").addEventListener('input', (event) => {

    let element = event.target as HTMLInputElement;
    updateCanvasWidth(Number(element.value));

})

document.getElementById("canvas-height").addEventListener('input', (event) => {

    let element = event.target as HTMLInputElement;
    updateCanvasHeight(Number(element.value));

})

document.getElementById("device-pixel-ratio").addEventListener('input', (event) => {

    let element = event.target as HTMLInputElement;
    updateDevicePixelRatio(Number(element.value));

})

document.getElementById('draw-triangle').addEventListener('click', () => {
    drawTriangle();
})

document.getElementById('draw-square').addEventListener('click', () => {
    drawSquare();
})

document.getElementById('draw-polygon').addEventListener('click', () => {
    drawPolygon();
})