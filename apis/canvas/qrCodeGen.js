const { createCanvas } = require("canvas");
const QRCode = require("qrcode");

const qrCodeGen = async (req, res) => {
  const url = req.query;
  if (!url) {
    return res.status(400).json({ error: "url must be defined" });
  } else {
    return res.status(200).json({ message: "Working" });
  }
};

module.exports = qrCodeGen;
