const permissionComparisons = require("../../helper_functions/discord_specific/permissionComparisons");

const permissionComp = async (req, res) => {
  try {
    if (req.query.value1 == undefined || req.query.value2 == undefined) {
      return res
        .status(400)
        .json({ error: `value1 and value2 must be defined` });
    }

    if (!/^\d+$/.test(req.query.value1)) {
      return res
        .status(400)
        .json({ error: "Invalid value1. Must be a non-negative number." });
    } else if (!/^\d+$/.test(req.query.value2)) {
      return res
        .status(400)
        .json({ error: "Invalid value2. Must be a non-negative number." });
    }

    const value1 = BigInt(req.query.value1);
    const value2 = BigInt(req.query.value2);

    const result = permissionComparisons(value1, value2);
    return res.status(200).json({ permissions: result });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = permissionComp;
