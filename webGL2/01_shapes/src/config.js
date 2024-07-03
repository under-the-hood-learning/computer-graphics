import obj from "./objects.js";
export default {
    scale: 1,
    clipPositionX: 0, // float ranging from -1 to 1
    clipPositionY: 0, // float ranging from -1 to 1
    width_in_pixels: window.innerWidth / 3.5, // canvas/screen space width 
    height_in_pixels: window.innerHeight / 2, // canvas/screen space width 
    canvas: $('#demo-canvas')[0],
    shape: new obj.Shape([], []),
    polygon_segment_count: 8,
    polygon_center: [0, 0], // float ranging from -1 to 1
    polygon_radius: 1 / 2, // float ranging from -1 to 1
    polygon_vertices_color: "#788750",
    polygon_center_color: "#ffffff",
};
