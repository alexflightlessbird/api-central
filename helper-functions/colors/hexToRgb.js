function hexToRgb(h) {
  return [
    ("0x" + h[0] + h[1]) | 0,
    ("0x" + h[2] + h[3]) | 0,
    ("0x" + h[4] + h[5]) | 0,
  ];
}

module.exports = hexToRgb;
