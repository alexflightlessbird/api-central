const { createCanvas, loadImage } = require("canvas");

const faceClaim = async (req, res) => {
  try {
    const { imageurl } = req.query;

    if (!imageurl) {
      return res.status(400).json({ error: "imageurl must be defined" });
    }

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
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 0, 0)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const circleRadius = canvas.height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleRadius, canvas.height / 2, circleRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, 0, 0, circleRadius * 2, circleRadius * 2);
    ctx.restore();

    ctx.textBaseline = "middle";
    ctx.fillStyle = "red";
    ctx.font = "36px EB Garamond";
    ctx.fillText(charname, circleRadius * 2 + 10, canvas.height / 2 + 10);

    res.writeHead(200, { "Content-Type": "image/png" });
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = faceClaim;
