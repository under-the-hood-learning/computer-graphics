import obj from "./objects.js";
import geometry from "./geometry.js";

export default {

    scale: 1,
    clipPositionX: 0, // float ranging from -1 to 1
    clipPositionY: 0, // float ranging from -1 to 1
    width_in_pixels: window.innerWidth / 3.5, // canvas/screen space width 
    height_in_pixels: window.innerHeight / 2, // canvas/screen space width 
    canvas: $('#demo-canvas')[0],
    shape: new obj.Shape([], []),
    circle_segment_count: 8,
    circle_center: [0, 0] // float ranging from -1 to 1

}
