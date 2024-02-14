const isValidHexColor = require("../../helper-functions/colors/isValidHexColor");

const checkHexColor = async (req, res) => {
  try {
    const hex = req.query.color;
    if (hex === undefined) {
      return res.status(400).json({ error: "color must be defined" });
    }

    if (isValidHexColor(hex)) {
      return res.status(200).json({
        hex_color: true,
        colorUrl: `https://color-hex.org/color/${hex}`,
      });
    } else {
      return res.status(200).json({ hex_color: false });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = checkHexColor;
