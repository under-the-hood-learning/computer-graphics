import * as utils from './utils.js';
import objects from './objects.js';
import {config} from './config.js';

const myShape : WebGL2RenderingContext = shape(window.innerWidth, window.innerHeight, config.scale, config.clipPositionX, config.clipPositionY, objects.triangleVertices) as WebGL2RenderingContext;

export function shape(width, height, scale, clipPositionX, clipPositionY, triangleVertices) {
    
    const canvas = document.getElementById('demo-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        utils.showError("You've just made a terrible mistake!");
        return;
    }
            
    //console.log(canvas);

    const webGL2 = canvas.getContext('webgl2');

    // console.log(webGL2);

    //---------------------------------------------------------------------------------

    const triangleGeoCPUBuffer = new Float32Array(triangleVertices);
    const triangleGeoGPUBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, triangleGeoGPUBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, triangleGeoCPUBuffer, webGL2.STATIC_DRAW)
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    const rgbColorBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, rgbColorBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, objects.rgbTriangleColors, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    //---------------------------------------------------------------------------------

    const vertexShaderSourceCode = 
        `#version 300 es
        precision mediump float;

        in vec3 vertexColor;
        in vec2 vertexPosition;

        out vec3 fragmentColor;

        uniform vec2 canvasSize;
        uniform vec2 shapeLocation;
        uniform float shapeSize;

        void main() {

            fragmentColor = vertexColor;

            vec2 finalVertexPosition = vertexPosition * shapeSize + shapeLocation;
            vec2 clipPosition = (finalVertexPosition / canvasSize) * 2.0 - 1.0;

            gl_Position = vec4(clipPosition, 0.0, 1.0);
        }`;
                                    
    // console.log(vertexShaderSourceCode);

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
    const shapeSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeSize');
    const shapeLocationUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeLocation');
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
    webGL2.uniform1f(shapeSizeUniform, scale);
    webGL2.uniform2f(shapeLocationUniform, ( ( clipPositionX + 1 ) / 2 ) * canvas.width, ( ( clipPositionY + 1) / 2 ) * canvas.height);
    webGL2.drawArrays(webGL2.TRIANGLES, 0, 3);

    //---------------------------------------------------------------------------------

    let auxCanvas = $('#aux-canvas')[0] as HTMLCanvasElement;
    let Context2D = auxCanvas.getContext('2d');
    
    auxCanvas.style.width = `${width}px`;
    auxCanvas.style.height = `${height}px`;
    auxCanvas.width = width * devicePixelRatio;
    auxCanvas.height = height * devicePixelRatio;

    const text = "Screen space";
    const fontSize = 20 * devicePixelRatio;
    Context2D.font = `${fontSize}px Arial`;
    Context2D.fillStyle = 'white';

    // Calculate the position to draw the text
    const textWidth = Context2D.measureText(text).width;
    const x = (canvas.width - textWidth - 10); // 10 pixels padding from the right edge
    const y = fontSize; // Drawing the text at the font size height from the top edge

    // Draw the text on the canvas
    Context2D.fillText(text, x, y);

    //---------------------------------------------------------------------------------


    return webGL2;

}