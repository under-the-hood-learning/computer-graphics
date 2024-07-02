import * as controllers from './controllers.js';
import config from './config.js';
import objects from './objects.js';

export let showError = function(errorText: string) {
    console.log(errorText);
    // $("#error-box").empty();

    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null){
        return;
    }

    errorBoxDiv.style.display = "flex";

    const errorElement = document.createElement('p');
    errorElement.innerText = errorText;
    errorBoxDiv.appendChild(errorElement);
}

export let buildCircleVertexBuffer = function() {

    const vertexData = [];

    const angle_increment = (Math.PI * 2 / config.circle_segment_count);

    for (let i = 0; i < config.circle_segment_count; i++) {
        
        const vertex1Angle = i * angle_increment;
        const vertex2Angle = (i + 1) * angle_increment;
        
        const x1 = Math.cos(vertex1Angle)/10;
        const y1 = Math.sin(vertex1Angle)/10;

        const x2 = Math.cos(vertex2Angle)/10;
        const y2 = Math.sin(vertex2Angle)/10;

        let centerX = config.circle_center[0]; 
        let centerY = config.circle_center[1];

        vertexData.push(
           centerX , centerY, 
        );

        vertexData.push(
            x1 + centerX, y1 + centerY,  
        );

        vertexData.push(
            x2 + centerX, y2 + centerY, 
        );
    }
    return vertexData;

}

export let buildCircleColorBuffer = function() {

    const vertexData = [];
    for (let i = 0; i < config.circle_segment_count; i++) {

        vertexData.push(
            255, 255, 255
        );

        vertexData.push(
            255, 255, 255
        );

        vertexData.push(
            255, 255, 255
        );

    }


    return vertexData;

}

export let hexToRgbArray = function(hex) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the three components
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return [r, g, b];
}

export let rgbToHex = function(rgbArray : Uint8Array) {

    let hexStr = "#" + Array.from(rgbArray).map(value => {
        // Convert each number to a two-digit hexadecimal string
        let hex = value.toString(16);
        return  hex.length === 1 ? '0' + hex : hex;

    }).join('');


    return hexStr;
}

export let drawPoint = function(context : CanvasRenderingContext2D, x : number, y : number, size : number, color : Uint8Array) {

    let radius = size * devicePixelRatio;
    let hexColor = rgbToHex(color);

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
    context.fillStyle = hexColor; // Color of the point
    context.fill();

}

export let FromClipSpaceTo2DCanvasCoordinatesSystem = function(clipSpaceArray : Array<number>, canvas) {

    // For X Coordinates
    for (let i=0; i < clipSpaceArray.length; i = i + 2) {

        clipSpaceArray[i] = ((clipSpaceArray[i] + 1) / 2 ) * canvas.width;

    };

    // For X Coordinates
    for (let i=1; i < clipSpaceArray.length; i = i + 2) {

        clipSpaceArray[i] = ( 1 - ((clipSpaceArray[i] + 1) / 2 ) ) * canvas.height;

    }

    return clipSpaceArray;

}

export function renderShapeWithWebGL2(shape, width, height, canvas) {

    if (!(canvas instanceof HTMLCanvasElement)) {
        showError("Something went wrong.");
        return;
    }  

    const webGL2 = canvas.getContext('webgl2');

    //---------------------------------------------------------------------------------

    const triangleGeoGPUBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, triangleGeoGPUBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, new Float32Array(shape.vertices), webGL2.STATIC_DRAW)
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    const rgbColorGPUBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, rgbColorGPUBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, new Uint8Array(shape.colors), webGL2.STATIC_DRAW);
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

    //---------------------------------------------------------------------------------
    
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

    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, rgbColorGPUBuffer);
    webGL2.vertexAttribPointer(vertexColorAttributeLocation, 3, webGL2.UNSIGNED_BYTE, true, 0, 0);

    webGL2.bindVertexArray(null);

    //---------------------------------------------------------------------------------

    webGL2.drawArrays(webGL2.TRIANGLES, 0, shape.vertices.length);

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

    auxCanvasContext.clearRect(0, 0, auxCanvas.width, auxCanvas.height);
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

    let vertexes2D = FromClipSpaceTo2DCanvasCoordinatesSystem(new Array(... shape.vertices), clipSpaceCanvas);

    clipSpaceContext.clearRect(0, 0, clipSpaceCanvas.width, clipSpaceCanvas.height);
        
    vertexes2D.forEach( (vertex, index) => {
        drawPoint(clipSpaceContext, vertexes2D[0 + 2 * index], vertexes2D[1 + 2 * index], 5, shape.colors.slice(3 * index, 3 + 3 * index));
    });

    //---------------------------------------------------------------------------------

}