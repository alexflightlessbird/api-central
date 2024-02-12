function randomHexColor() {
  const characters = "0123456789ABCDEF";
  let hexCode = "#";
  for (let i = 0; i < 6; i++) {
    hexCode += characters[Math.floor(Math.random() * 16)];
  }
  return hexCode;
}

module.exports = randomHexColor;
