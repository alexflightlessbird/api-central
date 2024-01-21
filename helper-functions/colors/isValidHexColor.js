function isValidHexColor(color) {
  // Regular expression to match a valid hex color (3 or 6 characters, optionally starting with #)
  const hexColorRegex = /^#?([0-9A-Fa-f]{3}){1,2}$/;
  const isValid = hexColorRegex.test(color);
  return isValid;
}

module.exports = isValidHexColor;