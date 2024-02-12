const QRCode = require("qrcode");

async function generateQRCode(url) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
}

module.exports = generateQRCode;
