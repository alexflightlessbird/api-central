const { createCanvas, loadImage } = require("canvas");
const generateQRCode = require("../../helper_functions/other/generateQRCode");
const isValidURL = require("../../helper_functions/other/isValidURL");

const qrCode = async (req, res) => {
  const { url, size } = req.query;
  if (!url || !isValidURL(url)) {
    return res.status(400).json({ error: "url is either invalid or missing" });
  }

  let canvasSize;

  if (!size || Number(size) == NaN) {
    canvasSize = 500;
  } else if (Number(size) > 1000) {
    canvasSize = 1000;
  } else if (Number(size) < 100) {
    canvasSize = 100;
  } else {
    canvasSize = Number(size);
  }

  try {
    const qrCodeDataURL = await generateQRCode(url);

    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    const image = await loadImage(qrCodeDataURL);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBuffer = canvas.toBuffer("image/png");

    res.set("Content-Type", "image/png");
    res.status(200).send(pngBuffer);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = qrCode;
