import { renderShapeWithWebGL2, initializeControllers } from './utils.js';
import obj from './objects.js';
import config from './config.js';

initializeControllers();

// config.shape = new obj.Shape(obj.squareVertices, obj.squareColors);
config.shape = new obj.Shape(obj.triangleVertices, obj.rgbTriangleColors);

renderShapeWithWebGL2(config.shape, window.innerWidth, window.innerHeight, config.canvas);

