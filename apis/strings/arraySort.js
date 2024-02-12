const arraySort = async (req, res) => {
  try {
    const { inputArray } = req.body;

    if (!Array.isArray(inputArray)) {
      return res
        .status(400)
        .json({ error: "inputArray must be an array of values" });
    }

    const sortedArray = inputArray.slice().sort();
    const sortedString = sortedArray.join(", ");
    res.status(200).json({ array: sortedArray, string: sortedString });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = arraySort;
