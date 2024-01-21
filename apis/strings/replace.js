const replaceText = async (req, res) => {
  try {
    const { string, whatToReplace, replaceValue } = req.body;

    if (
      string == undefined ||
      whatToReplace == undefined ||
      replaceValue == undefined
    ) {
      return res.status(400).json({
        error:
          "All values must be defined - string, whatToReplace, replaceValue",
      });
    }

    let ignoreCase = false;
    if (req.body.ignoreCase == "true") {
      ignoreCase = true;
    }

    let toReplace;
    if (ignoreCase) {
      toReplace = new RegExp(whatToReplace, "gi");
    } else {
      toReplace = new RegExp(whatToReplace, "g");
    }

    const newString = string.replace(toReplace, replaceValue);

    return res.status(200).json({ newString: newString });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: `${error}` });
  }
};

module.exports = replaceText;
