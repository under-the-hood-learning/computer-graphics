import config from "./config.js";
import { buildCircleColorBuffer, buildCircleVertexBuffer } from "./utils.js";

export default {

    triangleVertices: [
        -0.5, -0.5, 
        +0.5, -0.5, 
        +0.0, +0.5
    ],

    rgbTriangleColors: [
        255, 0, 0,
        0, 255, 0,
        0, 0, 255,
    ],
    
    squareVertices: [
        -1/2, +1/2, 
        -1/2, -1/2, 
        +1/2, -1/2, 
        -1/2, 1/2, 
        +1/2, -1/2, 
        +1/2, +1/2
    ],

    squareColors: [
        167, 153, 255,
        88, 62, 122,
        88, 62, 122,
        167, 153, 255,
        88, 62, 122,
        167, 153, 255
    ],

    circleVertices : buildCircleVertexBuffer(),

    circleColors: buildCircleColorBuffer(),

} 
