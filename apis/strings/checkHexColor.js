const isValidHexColor = require("../../helper-functions/colors/isValidHexColor");

const checkHexColor = async (req, res) => {
    const hex = req.query.color;
    if (hex === undefined) {
        return res.status(400).json({ error: 'color must be defined' });
    }

    if (isValidHexColor(hex)) {
        return res.status(200).json({ hex_color: true });
    } else {
        return res.status(200).json({ hex_color: false });
    }
}

module.exports = checkHexColor;