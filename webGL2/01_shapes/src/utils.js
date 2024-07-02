export let hexToRgbArray = function (hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');
    // Parse the three components
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
};
export let rgbToHex = function (rgbArray) {
    let hexStr = "#" + Array.from(rgbArray).map(value => {
        // Convert each number to a two-digit hexadecimal string
        let hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    return hexStr;
};
export let extractNumbers = function (input) {
    const numericString = input.replace(/[^0-9.-]/g, '');
    return parseFloat(numericString);
};
export let drawPoint = function (context, x, y, size, color) {
    let radius = size * devicePixelRatio;
    let hexColor = rgbToHex(color);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
    context.fillStyle = hexColor; // Color of the point
    context.fill();
};
export let FromClipSpaceTo2DCanvasCoordinatesSystem = function (clipSpaceArray, canvas) {
    // For X Coordinates
    for (let i = 0; i < clipSpaceArray.length; i = i + 2) {
        clipSpaceArray[i] = ((clipSpaceArray[i] + 1) / 2) * canvas.width;
    }
    ;
    // For X Coordinates
    for (let i = 1; i < clipSpaceArray.length; i = i + 2) {
        clipSpaceArray[i] = (1 - ((clipSpaceArray[i] + 1) / 2)) * canvas.height;
    }
    return clipSpaceArray;
};
