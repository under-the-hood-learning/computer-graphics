import obj from "./objects.js"

export default {

    scale: 1,
    clipPositionX: 0, // float randing from -1 to 1
    clipPositionY: 0, // float randing from -1 to 1
    width_in_pixels: window.innerWidth, // canvas/screen space width 
    height_in_pixels: window.innerHeight, // canvas/screen space width 
    canvas: $('#demo-canvas')[0],
    shape: new obj.Shape(obj.triangleVertices, obj.rgbTriangleColors),

}