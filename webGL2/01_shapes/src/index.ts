import * as controllers from './controllers.js';
import { extractNumbers, drawPoint, FromClipSpaceTo2DCanvasCoordinatesSystem } from './utils.js';
import objects from './objects.js';
import {config} from './config.js';

//---------------------------------------------------------------------------------
// Initializing controllers

$('#width-in-pixels').html(String(config.width_in_pixels.toFixed(2)) + "px");
$('#width-proportion').html(String((100 * config.width_in_pixels/window.innerWidth).toFixed(0)) + "%");

$('#height-in-pixels').html(String(config.height_in_pixels.toFixed(2)) + "px");
$('#height-proportion').html(String((100 * config.height_in_pixels/window.innerHeight).toFixed(0)) + "%");

let devicePixelRelationController = document.getElementById("device-pixel-ratio") as HTMLInputElement;
devicePixelRelationController.max = devicePixelRatio.toString();

devicePixelRatio = 1.00;

let devicePixelRelationValue = document.getElementById("device-pixel-ratio-value") as HTMLInputElement;
devicePixelRelationValue.value = devicePixelRatio.toFixed(2).toString();

//---------------------------------------------------------------------------------

const myShape : WebGL2RenderingContext = shapesAndColors(window.innerWidth, window.innerHeight, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices, objects.rgbTriangleColors) as WebGL2RenderingContext;

controllers.showError("It's everything good.");

export function shapesAndColors(width, height, scale, clipPositionX, clipPositionY, vertexes, colors : Uint8Array) {
    
    const canvas = document.getElementById('demo-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        controllers.showError("Something went wrong.");
        return;
    }  

    const webGL2 = canvas.getContext('webgl2');

    //---------------------------------------------------------------------------------

    const triangleGeoCPUBuffer = new Float32Array(vertexes);
    const triangleGeoGPUBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, triangleGeoGPUBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, triangleGeoCPUBuffer, webGL2.STATIC_DRAW)
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    const rgbColorBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, rgbColorBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, colors, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    //---------------------------------------------------------------------------------

    const vertexShaderSourceCode = 
        `#version 300 es
        precision mediump float;

        in vec3 vertexColor;
        in vec2 vertexPosition;

        out vec3 fragmentColor;

        void main() {

            fragmentColor = vertexColor;

            gl_Position = vec4(vertexPosition, 0.0, 1.0);

        }`;
                                    

    const vertexShader = webGL2.createShader(webGL2.VERTEX_SHADER);
    webGL2.shaderSource(vertexShader, vertexShaderSourceCode);
    webGL2.compileShader(vertexShader);

    //---------------------------------------------------------------------------------

    const fragmentShaderSourceCode = 
        `#version 300 es
        precision mediump float;

        in vec3 fragmentColor;
        out vec4 outputColor;

        void main() {        

            outputColor = vec4(fragmentColor, 0.0);
        
        }`;

    const fragmentShader = webGL2.createShader(webGL2.FRAGMENT_SHADER);
    webGL2.shaderSource(fragmentShader, fragmentShaderSourceCode);
    webGL2.compileShader(fragmentShader);

    //---------------------------------------------------------------------------------

    const webGL2TriangleProgram = webGL2.createProgram();
    webGL2.attachShader(webGL2TriangleProgram, vertexShader);
    webGL2.attachShader(webGL2TriangleProgram, fragmentShader);
    webGL2.linkProgram(webGL2TriangleProgram);

    //---------------------------------------------------------------------------------
    // Get references to webGL program variables.

    const vertexPositionAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexPosition');
    const vertexColorAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexColor');
    const canvasSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'canvasSize');

    //---------------------------------------------------------------------------------
    // devicePixelRatio = 1;
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    webGL2.clearColor(0, 0, 0, 0);
    webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
    webGL2.viewport(0,0, canvas.width, canvas.height);

    //---------------------------------------------------------------------------------

    webGL2.useProgram(webGL2TriangleProgram);

    webGL2.enableVertexAttribArray(vertexPositionAttributeLocation);
    webGL2.enableVertexAttribArray(vertexColorAttributeLocation);
    
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, triangleGeoGPUBuffer);
    webGL2.vertexAttribPointer(vertexPositionAttributeLocation, 2, webGL2.FLOAT, false, 0, 0);

    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, rgbColorBuffer);
    webGL2.vertexAttribPointer(vertexColorAttributeLocation, 3, webGL2.UNSIGNED_BYTE, true, 0, 0);

    webGL2.bindVertexArray(null);

    //---------------------------------------------------------------------------------

    webGL2.uniform2f(canvasSizeUniform, canvas.width, canvas.height);
    webGL2.drawArrays(webGL2.TRIANGLES, 0, 3);

    //---------------------------------------------------------------------------------
    // Drawing annotations on auxiliary canvas.

    let auxCanvas = $('#aux-canvas')[0] as HTMLCanvasElement;
    let auxCanvasContext = auxCanvas.getContext('2d');
    
    auxCanvas.style.width = `${width}px`;
    auxCanvas.style.height = `${height}px`;
    auxCanvas.width = width * devicePixelRatio;
    auxCanvas.height = height * devicePixelRatio;

    const text = "Screen space";
    const fontSize = 20 * devicePixelRatio;
    const textWidth = auxCanvasContext.measureText(text).width;
    const x = (auxCanvas.width - textWidth * devicePixelRatio - 80 * devicePixelRatio);
    const y = fontSize;
    auxCanvasContext.font = `${fontSize}px Arial`;
    auxCanvasContext.fillStyle = 'white';

    // Draw the text on the canvas
    auxCanvasContext.fillText(text, x, y);

    //---------------------------------------------------------------------------------
    // Drawing vertexes on clip space canvas

    let clipSpaceCanvas = document.getElementById('clip-space-canvas') as HTMLCanvasElement;
    let clipSpaceContext = clipSpaceCanvas.getContext('2d');

    clipSpaceCanvas.style.width = `${150}px`;
    clipSpaceCanvas.style.height = `${150}px`;
    clipSpaceCanvas.width = 150 * devicePixelRatio;
    clipSpaceCanvas.height = 150 * devicePixelRatio;

    let vertexes2D = FromClipSpaceTo2DCanvasCoordinatesSystem(new Array(... vertexes), clipSpaceCanvas);

    drawPoint(clipSpaceContext, vertexes2D[0 + 2 * 0], vertexes2D[1 + 2 * 0], 5, colors.slice(0, 3));
    drawPoint(clipSpaceContext, vertexes2D[0 + 2 * 1], vertexes2D[1 + 2 * 1], 5, colors.slice(3, 6));
    drawPoint(clipSpaceContext, vertexes2D[0 + 2 * 2], vertexes2D[1 + 2 * 2], 5, colors.slice(6, 9));

    //---------------------------------------------------------------------------------

    return webGL2;

}