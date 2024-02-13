const permissionCalculations = require("../../helper-functions/discord_specific/permissionCalculations");

const permissionCalc = async (req, res) => {
  try {
    if (req.query.value == undefined) {
      return res.status(400).json({ error: `value must be defined` });
    }

    if (!/^\d+$/.test(req.query.value)) {
      return res
        .status(400)
        .json({ error: "Invalid value. Must be a non-negative number." });
    }

    const value = BigInt(req.query.value);

    const result = permissionCalculations(value);

    const truePerms = Object.keys(result).filter((perm) => result[perm]);

    if (req.query.type === "show_all") {
      return res.status(200).json(result);
    } else if (req.query.type === "string") {
      const truePermsString = truePerms.join(", ");
      return res.status(200).json({ permissions: truePermsString });
    } else {
      return res.status(200).json(truePerms);
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = permissionCalc;
