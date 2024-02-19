const avgColorFromImage = require("../../helper_functions/colors/avgColorFromImage");
const rgbToHex = require("../../helper_functions/colors/rgbToHex");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const avgColorFromImageUrl = async (req, res) => {
  try {
    const { imageurl } = req.query;

    if (!imageurl) {
      return res.status(400).json({ error: "imageurl must be defined" });
    }

    const response = await axios.head(imageurl, { validateStatus: null });
    const contentType = response.headers["content-type"];

    if (
      response.status !== 200 ||
      !contentType ||
      !contentType.startsWith("image")
    ) {
      return res.status(400).json({ error: "imageurl must point to an image" });
    }

    const image = await loadImage(imageurl);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
    let imageColor = avgColorFromImage(imageData);
    imageColor = rgbToHex(imageColor[0], imageColor[1], imageColor[2]).toUpperCase();

    return res.json({
      color: `#${imageColor}`,
      colorUrl: `https://color-hex.org/color/${imageColor}`,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = avgColorFromImageUrl;
