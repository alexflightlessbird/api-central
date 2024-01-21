const { createCanvas } = require("canvas");

const isValidHexColor = require("../../helper-functions/colors/isValidHexColor");
const avgHexColor = require("../../helper-functions/colors/avgHexColor");

const progressBar = async (req, res) => {
  const {
    bgcolor,
    maxval,
    val,
    fillcolor,
    barcolor,
    fontcolor,
    grad,
    gradcolor,
    showval,
    showpercent,
  } = req.query;

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

  if (tval > tmax) {
    res.status(400).json({
      error: "Required value val must be less than or equal to maxval",
    });
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

  let grdcol;

  if (grad == "true") {
    if (gradcolor) {
      if (!isValidHexColor(gradcolor)) {
        res.status(400).json({ error: "Please provide valid hex codes" });
        return;
      } else {
        grdcol = gradcolor;
      }
    } else {
      grdcol = avgHexColor(fill, bar);
    }
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

  if (grad == "true") {
    const grd = context.createLinearGradient(0, 0, progressPercentFill, 0);
    grd.addColorStop(0, `#${fill}`);
    grd.addColorStop(1, `#${grdcol}`);
    context.fillStyle = grd;
    context.fillRect(10, 10, progressPercentFill, canvas.height - 20);
  } else {
    context.fillStyle = `#${fill}`;
    context.fillRect(10, 10, progressPercentFill, canvas.height - 20);
  }

  let fontcol;

  if (showval == "true" || showpercent == "true") {
    if (fontcolor) {
      if (!isValidHexColor(fontcolor)) {
        res.status(400).json({ error: "Please provide valid hex codes" });
        return;
      } else {
        fontcol = fontcolor;
      }
    } else {
      fontcol = "07004d";
    }

    let position = 15 + progressPercentFill;
    if (progressPercentage >= 80) {
      position = progressPercentFill - 55;
      if (!fontcolor) {
        fontcol = "c8c6d7";
      }
    }

    if (showval == "true") {
      context.font = "30px serif";
      context.fillStyle = `#${fontcol}`;
      context.fillText(`${tval.toFixed(0)}`, position, 60);
    } else if (showpercent == "true") {
      context.font = "30px serif";
      context.fillStyle = `#${fontcol}`;
      context.fillText(`${progressPercentage.toFixed(0)}%`, position, 60);
    }
  }

  res.status(200);
  res.setHeader("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res);
};

module.exports = progressBar;