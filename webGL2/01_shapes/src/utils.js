import { config } from "../src/config.js";
import objects from "../src/objects.js";
import { shape } from "../src/index.js";
export let updateTriangle = function (new_value, vertex_number, coordinate_number) {
    objects.triangleVertices[vertex_number * 2 + coordinate_number] = new_value;
    shape(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices);
};
export let updateCanvasWidth = function (width) {
    let canvas = document.getElementById("demo-canvas");
    config.width_in_pixels = window.innerWidth * width / 100;
    shape(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices);
};
export let updateCanvasHeight = function (height) {
    let canvas = document.getElementById("demo-canvas");
    config.height_in_pixels = window.innerHeight * height / 100;
    shape(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices);
};
export let updateclipPositionX = function (new_clipPositionX) {
    config.clipPositionX = new_clipPositionX;
    shape(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices);
};
export let updateclipPositionY = function (new_clipPositionY) {
    config.clipPositionY = new_clipPositionY;
    shape(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices);
};
export let updateScale = function (new_scale) {
    config.scale = new_scale;
    shape(config.width_in_pixels, config.height_in_pixels, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices);
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
    updateTriangle(element.value, 0, 0);
});
document.getElementById("vertexA-Y").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangle(element.value, 0, 1);
});
document.getElementById("vertexB-X").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangle(element.value, 1, 0);
});
document.getElementById("vertexB-Y").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangle(element.value, 1, 1);
});
document.getElementById("vertexC-X").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangle(element.value, 2, 0);
});
document.getElementById("vertexC-Y").addEventListener('input', (event) => {
    let element = event.target;
    updateTriangle(element.value, 2, 1);
});
document.getElementById("canvas-width").addEventListener('input', (event) => {
    let element = event.target;
    updateCanvasWidth(Number(element.value));
});
document.getElementById("canvas-height").addEventListener('input', (event) => {
    let element = event.target;
    updateCanvasHeight(Number(element.value));
});
document.getElementById("x-clip-position").addEventListener('input', (event) => {
    let element = event.target;
    updateclipPositionX(Number(element.value));
});
document.getElementById("y-clip-position").addEventListener('input', (event) => {
    let element = event.target;
    updateclipPositionY(Number(element.value));
});
document.getElementById("scale").addEventListener('input', (event) => {
    let element = event.target;
    updateScale(Number(element.value));
});
