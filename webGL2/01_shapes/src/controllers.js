import { config } from "./config.js";
import objects from "./objects.js";
import { shapesAndColors } from "./index.js";
import { hexToRgbArray } from "./utils.js";
export let updateCanvasWidth = function (width) {
    let canvas = document.getElementById("demo-canvas");
    config.width_in_pixels = window.innerWidth * width / 100;
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
    //Update controls displayed value
    width = Number(width);
    $('#width-in-pixels').html(String(config.width_in_pixels.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");
};
export let updateCanvasHeight = function (height) {
    let canvas = document.getElementById("demo-canvas");
    config.height_in_pixels = window.innerHeight * height / 100;
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
    //Update controls displayed value
    $('#height-in-pixels').html(String(config.height_in_pixels.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%");
};
export let updateclipPositionX = function (new_clipPositionX) {
    config.clipPositionX = new_clipPositionX;
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
    //Update controls displayed value
    $('#origin-x-in-pixels').html(String((config.width_in_pixels / 2 * new_clipPositionX).toFixed(2)) + "px");
    $('#origin-x-proportion').html(String((100 / 2 * new_clipPositionX).toFixed(0)) + "%");
};
export let updateclipPositionY = function (new_clipPositionY) {
    config.clipPositionY = new_clipPositionY;
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
    //Update controls displayed value
    $('#origin-y-in-pixels').html(String((config.height_in_pixels / 2 * new_clipPositionY).toFixed(2)) + "px");
    $('#origin-y-proportion').html(String((100 / 2 * new_clipPositionY).toFixed(0)) + "%");
};
export let updateScale = function (new_scale) {
    config.scale = new_scale;
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
    //Update controls displayed value
    $('#scale-display-value').html(String((config.scale).toFixed(0)) + "X");
};
export let updateTriangleVertexes = function (new_value, vertex_number, coordinate_number) {
    objects.triangleVertices[vertex_number * 2 + coordinate_number] = Number(new_value);
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
};
export let updateTriangleVertexColor = function (new_color, vertexNumber) {
    let rgbArray = (hexToRgbArray(new_color));
    objects.rgbTriangleColors[0 + 3 * vertexNumber] = rgbArray[0];
    objects.rgbTriangleColors[1 + 3 * vertexNumber] = rgbArray[1];
    objects.rgbTriangleColors[2 + 3 * vertexNumber] = rgbArray[2];
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
};
export let updateDevicePixelRatio = function (new_value) {
    devicePixelRatio = new_value;
    let devicePixelRationController = document.getElementById("device-pixel-ratio-value");
    devicePixelRationController.value = new_value.toString();
    shapesAndColors(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors);
};
export let showError = function (errorText) {
    console.log(errorText);
    // $("#error-box").empty();
    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null) {
        return;
    }
    const errorElement = document.createElement('p');
    errorElement.innerText = errorText;
    errorBoxDiv.appendChild(errorElement);
};
document.getElementById("vertexA-X").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangleVertexes(element.value, 0, 0);
});
document.getElementById("vertexA-Y").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangleVertexes(element.value, 0, 1);
});
document.getElementById("vertexB-X").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangleVertexes(element.value, 1, 0);
});
document.getElementById("vertexB-Y").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangleVertexes(element.value, 1, 1);
});
document.getElementById("vertexC-X").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangleVertexes(element.value, 2, 0);
});
document.getElementById("vertexC-Y").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangleVertexes(element.value, 2, 1);
});
document.getElementById("canvas-width").addEventListener('input', (event) => {
    let element = event.target;
    updateCanvasWidth(Number(element.value));
});
document.getElementById("canvas-height").addEventListener('input', (event) => {
    let element = event.target;
    updateCanvasHeight(Number(element.value));
});
document.getElementById("device-pixel-ratio").addEventListener('input', (event) => {
    let element = event.target;
    updateDevicePixelRatio(Number(element.value));
});
// document.getElementById("x-clip-position").addEventListener('input', (event) => {
//     let element = event.target as HTMLInputElement;
//     updateclipPositionX(Number(element.value));
// })
// document.getElementById("y-clip-position").addEventListener('input', (event) => {
//     let element = event.target as HTMLInputElement;
//     updateclipPositionY(Number(element.value));
// })
// document.getElementById("scale").addEventListener('input', (event) => {
//     let element = event.target as HTMLInputElement;
//     updateScale(Number(element.value));
// })
$('.vertex-color').on('input', (event) => {
    let element = event.target;
    let vertexIndex = element.dataset.index;
    updateTriangleVertexColor(element.value, Number(vertexIndex));
});
