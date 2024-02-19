const { createCanvas, loadImage } = require("canvas");
const avgColorFromImage = require("../../helper-functions/colors/avgColorFromImage");
const isValidHexColor = require("../../helper-functions/colors/isValidHexColor");
const rgbToHex = require("../../helper-functions/colors/rgbToHex");
const axios = require("axios");

const faceClaim = async (req, res) => {
  try {
    const { imageurl } = req.query;

    // imageurl setup
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

    // charname setup
    let charname;
    if (req.query.charname) {
      charname = decodeURIComponent(req.query.charname);
    } else {
      charname = "";
    }
    if (req.query.charnamecolor) {
      if (!isValidHexColor(req.query.charnamecolor)) {
        //prettier-ignore
      }
    }

    // fcname setup
    let fcname;
    if (req.query.fcname) {
      fcname = `Faceclaim: ${decodeURIComponent(req.query.fcname)}`;
    } else {
      fcname = "";
    }
    if (req.query.fcnamecolor) {
      if (!isValidHexColor(req.query.fcnamecolor)) {
        //prettier-ignore
        return res.status(400).json({ error: "Please provide valid hex codes" });
      }
    }

    // user setup
    let user;
    if (req.query.user) {
      user = `Played by: ${decodeURIComponent(req.query.user)}`;
    } else {
      user = "";
    }
    if (req.query.usercolor) {
      if (!isValidHexColor(req.query.usercolor)) {
        //prettier-ignore
        return res.status(400).json({ error: "Please provide valid hex codes" });
      }
    }

    // canvas creation
    const image = await loadImage(imageurl);

    const canvas = createCanvas(800, 300);
    const ctx = canvas.getContext("2d");

    // make background transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 0, 0)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // image on left
    const circleRadius = canvas.height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleRadius, canvas.height / 2, circleRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, 0, 0, circleRadius * 2, circleRadius * 2);
    ctx.restore();
    //prettier-ignore
    const imageData = ctx.getImageData(0, 0, circleRadius * 2, circleRadius * 2).data;
    let imageColor = avgColorFromImage(imageData);
    imageColor = rgbToHex(imageColor[0], imageColor[1], imageColor[2]);

    // setting up width and font sizes
    let charFontSize = 100;
    do {
      ctx.font = `${charFontSize}px Oswald`;
      charFontSize--;

      const textWidth = ctx.measureText(charname).width;
      if (textWidth < canvas.width - circleRadius * 2 - 35) {
        break;
      }
    } while (charFontSize > 1);
    let width = ctx.measureText(charname).width;

    let fcFontSize = 60;
    do {
      ctx.font = `${fcFontSize}px EB Garamond`;
      fcFontSize--;

      const textWidth = ctx.measureText(fcname).width;
      if (textWidth < canvas.width - circleRadius * 2 - 35) {
        break;
      }
    } while (fcFontSize > 1);
    if (ctx.measureText(fcname).width > width) {
      width = ctx.measureText(fcname).width;
    }

    let userFontSize = 35;
    do {
      ctx.font = `${userFontSize}px EB Garamond`;
      userFontSize--;

      const textWidth = ctx.measureText(user).width;
      if (textWidth < canvas.width - circleRadius * 2 - 35) {
        break;
      }
    } while (userFontSize > 1);
    if (ctx.measureText(user).width > width) {
      width = ctx.measureText(user).width;
    }

    const centerOfRight = circleRadius * 2 + 20 + width / 2;

    // dashed line
    const starLine = "✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭⭒⭒⭒✭";
    ctx.textAlign = "center";
    ctx.font = "15px Segoe UI Symbol";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `#${imageColor}`;
    ctx.fillText(starLine, centerOfRight, canvas.height / 2);

    // character name
    let charFontColor;
    if (!req.query.charnamecolor) {
      charFontColor = `#${imageColor}`;
    } else {
      charFontColor = `#${req.query.charnamecolor}`;
    }
    ctx.fillStyle = charFontColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${charFontSize}px Oswald`;
    ctx.fillText(charname, centerOfRight, canvas.height / 4);

    // face claim name
    let fcFontColor;
    if (!req.query.fcnamecolor) {
      fcFontColor = `#${imageColor}`;
    } else {
      fcFontColor = `#${req.query.fcnamecolor}`;
    }
    ctx.fillStyle = fcFontColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${fcFontSize}px EB Garamond`;
    ctx.fillText(fcname, centerOfRight, 2.5 * (canvas.height / 4));
    //prettier-ignore
    const fcBottom = canvas.height / 2 + ctx.measureText(fcname).emHeightDescent;

    // user name
    let userFontColor;
    if (!req.query.userfontcolor) {
      userFontColor = `#${imageColor}`;
    } else {
      userFontColor = `#${req.query.userfontcolor}`;
    }
    ctx.fillStyle = userFontColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${userFontSize}px EB Garamond`;
    ctx.fillText(user, centerOfRight, 2 * (canvas.height / 4) + fcBottom / 2);

    // return image
    res.writeHead(200, { "Content-Type": "image/png" });
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = faceClaim;
