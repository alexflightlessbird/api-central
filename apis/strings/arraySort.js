const isNumber = require("../../helper-functions/numbers/isNumber");

const arraySort = async (req, res) => {
  try {
    const { inputArray } = req.body;

    if (!inputArray) {
      return res.status(400).json({ error: "inputArray must be defined" });
    }

    if (!Array.isArray(inputArray)) {
      return res
        .status(400)
        .json({ error: "inputArray must be an array of values" });
    }

    const numbersArray = [];
    const textArray = [];

    inputArray.forEach((value) => {
      if (isNumber(value)) {
        numbersArray.push(Number(value));
      } else {
        textArray.push(value);
      }
    });

    const sortedNumbers = numbersArray.slice().sort((a, b) => a - b);
    const sortedText = textArray.slice().sort();

    const sortedArray = sortedNumbers.concat(sortedText);
    const sortedString = sortedArray.join(", ");

    res.status(200).json({ array: sortedArray, string: sortedString });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = arraySort;
