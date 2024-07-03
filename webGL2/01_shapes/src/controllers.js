import config from "./config.js";
import geometry from "./geometry.js";
import { buildPolygonVertexBuffer, buildPolygonColorBuffer, renderShapeWithWebGL2 } from "./utils.js";
import { hexToRgbArray } from "./utils.js";
import objects from "./objects.js";
export function initializeControllers() {
    $('#width-in-pixels').html(String(config.width_in_pixels.toFixed(2)) + "px");
    $('#width-proportion').html(String((100 * config.width_in_pixels / window.innerWidth).toFixed(0)) + "%");
    $('#height-in-pixels').html(String(config.height_in_pixels.toFixed(2)) + "px");
    $('#height-proportion').html(String((100 * config.height_in_pixels / window.innerHeight).toFixed(0)) + "%");
    let devicePixelRelationController = document.getElementById("device-pixel-ratio");
    devicePixelRelationController.max = devicePixelRatio.toString();
    devicePixelRatio = 1.00;
    let devicePixelRelationValue = document.getElementById("device-pixel-ratio-value");
    devicePixelRelationValue.value = devicePixelRatio.toFixed(2).toString();
    // utils.showError("It's everything good.");
}
export let updateCanvasWidth = function (width) {
    config.width_in_pixels = window.innerWidth * width / 100;
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
    //Update controls displayed value
    width = Number(width);
    $('#width-in-pixels').html(String(config.width_in_pixels.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");
};
export let updateCanvasHeight = function (height) {
    config.height_in_pixels = window.innerHeight * height / 100;
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
    //Update controls displayed value
    $('#height-in-pixels').html(String(config.height_in_pixels.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%");
};
export let updateclipPositionX = function (new_clipPositionX) {
    config.clipPositionX = new_clipPositionX;
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
    //Update controls displayed value
    $('#origin-x-in-pixels').html(String((config.width_in_pixels / 2 * new_clipPositionX).toFixed(2)) + "px");
    $('#origin-x-proportion').html(String((100 / 2 * new_clipPositionX).toFixed(0)) + "%");
};
export let updateclipPositionY = function (new_clipPositionY) {
    config.clipPositionY = new_clipPositionY;
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
    //Update controls displayed value
    $('#origin-y-in-pixels').html(String((config.height_in_pixels / 2 * new_clipPositionY).toFixed(2)) + "px");
    $('#origin-y-proportion').html(String((100 / 2 * new_clipPositionY).toFixed(0)) + "%");
};
export let updateScale = function (new_scale) {
    config.scale = new_scale;
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
    //Update controls displayed value
    $('#scale-display-value').html(String((config.scale).toFixed(0)) + "X");
};
export let updateTriangleVertexes = function (new_value, vertex_number, coordinate_number) {
    geometry.triangleVertices[vertex_number * 2 + coordinate_number] = new_value;
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updateSquareVertexes = function (new_value, vertex_number, coordinate_number) {
    geometry.squareVertices[vertex_number * 2 + coordinate_number] = Number(new_value);
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updateTriangleVertexColor = function (new_color, vertexNumber) {
    let rgbArray = (hexToRgbArray(new_color));
    geometry.rgbTriangleColors[0 + 3 * vertexNumber] = rgbArray[0];
    geometry.rgbTriangleColors[1 + 3 * vertexNumber] = rgbArray[1];
    geometry.rgbTriangleColors[2 + 3 * vertexNumber] = rgbArray[2];
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updateSquareVertexColor = function (new_color, vertexNumber) {
    let rgbArray = (hexToRgbArray(new_color));
    geometry.squareColors[0 + 3 * vertexNumber] = rgbArray[0];
    geometry.squareColors[1 + 3 * vertexNumber] = rgbArray[1];
    geometry.squareColors[2 + 3 * vertexNumber] = rgbArray[2];
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updatePolygonCenter = function (new_value, coordinate) {
    config.polygon_center[coordinate] = Number(new_value);
    config.shape = new objects.Shape(buildPolygonVertexBuffer(), buildPolygonColorBuffer());
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updatePolygonVerticesNumber = function (new_value) {
    config.polygon_segment_count = Number(new_value);
    config.shape = new objects.Shape(buildPolygonVertexBuffer(), buildPolygonColorBuffer());
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updatePolygonExternalRadius = function (new_value) {
    config.polygon_radius = Number(new_value);
    config.shape = new objects.Shape(buildPolygonVertexBuffer(), buildPolygonColorBuffer());
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updatePolygonVerticesColor = function (new_value) {
    config.polygon_vertices_color = new_value;
    let colorVerticesRGB = hexToRgbArray(config.polygon_vertices_color);
    let colorCenterRGB = hexToRgbArray(config.polygon_center_color);
    config.shape = new objects.Shape(buildPolygonVertexBuffer(), buildPolygonColorBuffer(colorCenterRGB, colorVerticesRGB));
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updatePolygonCenterColor = function (new_value) {
    config.polygon_center_color = new_value;
    let colorVerticesRGB = hexToRgbArray(config.polygon_vertices_color);
    let colorCenterRGB = hexToRgbArray(config.polygon_center_color);
    config.shape = new objects.Shape(buildPolygonVertexBuffer(), buildPolygonColorBuffer(colorCenterRGB, colorVerticesRGB));
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let updateDevicePixelRatio = function (new_value) {
    devicePixelRatio = new_value;
    let devicePixelRationController = document.getElementById("device-pixel-ratio-value");
    devicePixelRationController.value = new_value.toString();
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let drawTriangle = function () {
    config.shape = new objects.Shape(geometry.triangleVertices, geometry.rgbTriangleColors);
    $(".vertices-control").css('display', 'none');
    $("#triangle-vertices").css('display', 'flex');
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let drawSquare = function () {
    config.shape = new objects.Shape(geometry.squareVertices, geometry.squareColors);
    $(".vertices-control").css('display', 'none');
    $("#square-vertices").css('display', 'flex');
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
export let drawPolygon = function () {
    config.shape = new objects.Shape(geometry.polygonVertices, geometry.polygonColors);
    $(".vertices-control").css('display', 'none');
    $("#polygon-vertices").css('display', 'flex');
    renderShapeWithWebGL2(config.shape, config.width_in_pixels, config.height_in_pixels, config.canvas);
};
$('#triangle-vertices').find('.vertex-coordinate').on('input', (event) => {
    let element = event.target;
    let value = Number(element.value);
    let vertexNumber = Number(element.dataset.index);
    let vertexCoordinate = Number(element.dataset.coordinate);
    updateTriangleVertexes(value, vertexNumber, vertexCoordinate);
});
$('#square-vertices').find('.vertex-coordinate').on('input', (event) => {
    let element = event.target;
    let value = Number(element.value);
    let vertexNumber = Number(element.dataset.index);
    let vertexCoordinate = Number(element.dataset.coordinate);
    updateSquareVertexes(value, vertexNumber, vertexCoordinate);
});
$('#triangle-vertices').find('.vertex-color').on('input', (event) => {
    let element = event.target;
    let vertexIndex = element.dataset.index;
    updateTriangleVertexColor(element.value, Number(vertexIndex));
});
$('#square-vertices').find('.vertex-color').on('input', (event) => {
    let element = event.target;
    let vertexIndex = element.dataset.index;
    updateSquareVertexColor(element.value, Number(vertexIndex));
});
$('.polygon-center').on('input', (event) => {
    let element = event.target;
    let coordinate = element.dataset.coordinate;
    updatePolygonCenter(element.value, coordinate);
});
$('#polygon-vertices-number').on('input', (event) => {
    let element = event.target;
    updatePolygonVerticesNumber(element.value);
});
$('#polygon-radius').on('input', (event) => {
    let element = event.target;
    updatePolygonExternalRadius(element.value);
});
$('#polygon-center-color').on('input', (event) => {
    let element = event.target;
    updatePolygonCenterColor(element.value);
});
$('#polygon-vertices-color').on('input', (event) => {
    let element = event.target;
    updatePolygonVerticesColor(element.value);
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
document.getElementById('draw-triangle').addEventListener('click', () => {
    drawTriangle();
});
document.getElementById('draw-square').addEventListener('click', () => {
    drawSquare();
});
document.getElementById('draw-polygon').addEventListener('click', () => {
    drawPolygon();
});
