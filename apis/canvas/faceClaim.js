const { createCanvas, loadImage } = require("canvas");

const faceClaim = async (req, res) => {
  try {
    const { imageurl } = req.query;
    let charname;
    if (req.query.charname) {
      charname = decodeURIComponent(req.query.charname);
    } else {
      charname = "";
    }
    let fcname;
    if (req.query.fcname) {
      fcname = decodeURIComponent(req.query.fcname);
    } else {
      fcname = "";
    }
    const image = await loadImage(imageurl);

    const canvas = createCanvas(800, 300);
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = `rgba(0, 0, 0, 0)`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const circleRadius = canvas.height / 2;
    context.save();
    context.beginPath();
    context.arc(circleRadius, canvas.height / 2, circleRadius, 0, Math.PI * 2);
    context.clip();
    context.drawImage(image, 0, 0, circleRadius * 2, circleRadius * 2);
    context.restore();

    context.fillStyle = "red";
    context.font = "20px Arial";
    context.fillText(charname, circleRadius * 2 + 10, canvas.height / 2 + 10);

    res.writeHead(200, { "Content-Type": "image/png" });
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = faceClaim;
