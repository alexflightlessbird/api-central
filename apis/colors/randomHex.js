const randomHexColor = require("../../helper_functions/colors/randomHexColor");
const isValidHexColor = require("../../helper_functions/colors/isValidHexColor");

const randomHex = async (req, res) => {
  try {
    const randomHexCode = randomHexColor();
    if (!isValidHexColor(randomHexCode)) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(200).json({
      hexCode: `#${randomHexCode}`,
      //prettier-ignore
      colorUrl: `https://color-hex.org/color/${randomHexCode}`,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = randomHex;
