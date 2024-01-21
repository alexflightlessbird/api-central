function rgbToHex(r, g, b) {
  hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

module.exports = rgbToHex;