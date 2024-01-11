const { createCanvas } = require("canvas");

function isValidHexColor(color) {
  // Regular expression to match a valid hex color (3 or 6 characters, optionally starting with #)
  const hexColorRegex = /^#?([0-9A-Fa-f]{3}){1,2}$/;
  const isValid = hexColorRegex.test(color);
  return isValid;
}

const progressBar = async (req, res) => {
  const { bgcolor, maxval, val, fillcolor, barcolor } = req.query;

  if (!maxval || !val) {
    res.status(400).json({
      error: "Required values must be defined - maxval & val",
    });
    return;
  }

  const tmax = Number(maxval);
  const tval = Number(val);

  if (!tmax || !tval) {
    res
      .status(400)
      .json({ error: "Required values maxval & val must be numbers" });
    return;
  }

  let fill;

  if (fillcolor) {
    if (!isValidHexColor(fillcolor)) {
      res.status(400).json({ error: "Please provide valid hex codes" });
      return;
    } else {
      fill = fillcolor;
    }
  } else {
    fill = "005ce7";
  }

  let bar;

  if (barcolor) {
    if (!isValidHexColor(barcolor)) {
      res.status(400).json({ error: "Please provide valid hex codes" });
      return;
    } else {
      bar = barcolor;
    }
  } else {
    bar = "c8c6d7";
  }

  const canvas = createCanvas(600, 100);
  const context = canvas.getContext("2d");

  if (bgcolor) {
    if (!isValidHexColor(bgcolor)) {
      res.status(400).json({ error: "Please provide valid hex codes" });
      return;
    } else {
      context.fillStyle = `#${bgcolor}`;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = `rgba(0, 0, 0, 0)`;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.fillStyle = `#${bar}`;
  context.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

  const progressPercentage = (tval / tmax) * 100;
  const progressPercentFill = (progressPercentage / 100) * (canvas.width - 20);
  context.fillStyle = `#${fill}`;
  context.fillRect(10, 10, progressPercentFill, canvas.height - 20);

  res.status(200);
  res.setHeader("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res);
};

module.exports = progressBar;
