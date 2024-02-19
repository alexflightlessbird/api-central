const rgbToHex = require("./rgbToHex");
const hexToRgb = require("./hexToRgb");

function avgHexColor(h1, h2) {
  a = hexToRgb(h1);
  b = hexToRgb(h2);
  return rgbToHex(
    ~~((a[0] + b[0]) / 2),
    ~~((a[1] + b[1]) / 2),
    ~~((a[2] + b[2]) / 2)
  );
}

module.exports = avgHexColor;
