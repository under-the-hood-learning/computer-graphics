import { renderShapeWithWebGL2 } from './utils.js';
import obj from './objects.js';
import config from './config.js';
import * as controllers from './controllers.js';
import geometry from './geometry.js';
controllers.initializeControllers();
config.shape = new obj.Shape(geometry.triangleVertices, geometry.rgbTriangleColors);
renderShapeWithWebGL2(config.shape, window.innerWidth / 3.5, window.innerHeight / 2, config.canvas);
