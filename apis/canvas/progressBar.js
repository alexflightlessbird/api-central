const { createCanvas } = require("canvas");

const isValidHexColor = require("../../helper-functions/colors/isValidHexColor");
const avgHexColor = require("../../helper-functions/colors/avgHexColor");
const isNumber = require("../../helper-functions/numbers/isNumber");

const progressBar = async (req, res) => {
  try {
    const {
      bgcolor, // color of background behind bar
      maxval, // max value - 100%
      val, // current value - how much of bar is done
      fillcolor, // color of what hasn't been done
      barcolor, // color of bar - completed section
      fontcolor, // color of font
      fontcolor1, // color of font >= 80%
      grad, // toggle gradient
      gradcolor, // if gradient enabled, what color to fade bar to
      showval, // toggle showing the current val
      showpercent, // toggle showing the percentage
    } = req.query;

    if (!maxval || !val) {
      return res.status(400).json({
        error: "Required values must be defined - maxval & val",
      });
    }

    if (!isNumber(maxval) || !isNumber(val)) {
      return res.status(400).json({ error: "maxval & val must be numbers" });
    }

    const tmax = Number(maxval);
    const tval = Number(val);

    if (tval > tmax) {
      return res.status(400).json({
        error: "Required value val must be less than or equal to maxval",
      });
    }

    let fill;

    if (fillcolor) {
      if (!isValidHexColor(fillcolor)) {
        return res
          .status(400)
          .json({ error: "Please provide valid hex codes" });
      } else {
        fill = fillcolor;
      }
    } else {
      fill = "005ce7";
    }

    let bar;

    if (barcolor) {
      if (!isValidHexColor(barcolor)) {
        return res
          .status(400)
          .json({ error: "Please provide valid hex codes" });
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
          return res
            .status(400)
            .json({ error: "Please provide valid hex codes" });
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
        return res
          .status(400)
          .json({ error: "Please provide valid hex codes" });
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
    const progressPercentFill =
      (progressPercentage / 100) * (canvas.width - 20);

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
          return res
            .status(400)
            .json({ error: "Please provide valid hex codes" });
        } else {
          fontcol = fontcolor;
        }
      } else {
        fontcol = "07004d";
      }

      let val;
      let str;

      if (showval == "true") {
        val = tval.toFixed(0);
        str = `${val}`;
      } else if (showpercent == "true") {
        val = progressPercentage.toFixed(0);
        str = `${val}%`;
      }

      let position;

      if (progressPercentage >= 80) {
        if (fontcolor1) {
          if (!isValidHexColor(fontcolor1)) {
            return res
              .status(400)
              .json({ error: "Please provide valid hex codes" });
          } else {
            fontcol = fontcolor1;
          }
        } else {
          fontcol = "c8c6d7";
        }

        let width = context.measureText(val).width;
        if (progressPercentage == 100) {
          position = progressPercentFill - 65 - width;
        } else {
          position = progressPercentFill - 55 - width;
        }
      } else {
        position = 20 + progressPercentFill;
      }

      context.font = "30px serif";
      context.fillStyle = `#${fontcol}`;
      context.fillText(str, position, 60);
    }

    res.status(200);
    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = progressBar;
