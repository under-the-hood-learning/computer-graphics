export default {

    Shape: class Shape {

        vertices : Array<number>;
        colors : Array<number>;
    
        constructor(vertices, colors) {
    
            this.vertices = vertices;
            this.colors = colors;

        }
    },

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
        -1, +1, 
        -1, -1, 
        +1, -1, 
        -1, 1, 
        +1, -1, 
        +1, +1
    ],

    squareColors: [
        167, 153, 255,
        88, 62, 122,
        88, 62, 122,
        167, 153, 255,
        88, 62, 122,
        167, 153, 255
    ],

} 
