function avgColorFromImage(imageData) {
  let sumRed = 0,
    sumGreen = 0,
    sumBlue = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    sumRed += imageData[i];
    sumGreen += imageData[i + 1];
    sumBlue += imageData[i + 2];
  }
  const totalPixels = imageData.length / 4;
  const avgRed = Math.round(sumRed / totalPixels);
  const avgGreen = Math.round(sumGreen / totalPixels);
  const avgBlue = Math.round(sumBlue / totalPixels);

  return [avgRed, avgGreen, avgBlue];
}

module.exports = avgColorFromImage;
