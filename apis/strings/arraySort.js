const isNumber = require("../../helper_functions/numbers/isNumber");

const arraySort = async (req, res) => {
  try {
    const { inputArray, sortOrder } = req.body;

    if (!inputArray) {
      return res.status(400).json({ error: "inputArray must be defined" });
    }

    if (!Array.isArray(inputArray)) {
      return res
        .status(400)
        .json({ error: "inputArray must be an array of values" });
    }

    let order;

    if (!sortOrder) {
      order = "alphabetical";
    } else if (sortOrder == "alphabetical" || sortOrder == "reverse") {
      order = sortOrder;
    } else {
      return res
        .status(400)
        .json({ error: "sortOrder must be either alphabetical or reverse" });
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

    const sortedNumbers =
      order === "reverse"
        ? numbersArray.slice().sort((a, b) => b - a)
        : numbersArray.slice().sort((a, b) => a - b);
    const sortedText =
      order === "reverse"
        ? textArray.slice().sort().reverse()
        : textArray.slice().sort();

    const sortedArray = sortedNumbers.concat(sortedText);
    const sortedString = sortedArray.join(", ");

    res.status(200).json({
      array: sortedArray,
      string: sortedString,
      numbersArray: sortedNumbers,
      numbersLength: sortedNumbers.length,
      numbersString: sortedNumbers.join(", "),
      textArray: sortedText,
      textLength: sortedText.length,
      textString: sortedText.join(", "),
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = arraySort;
