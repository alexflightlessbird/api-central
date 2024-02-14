const replaceText = async (req, res) => {
  try {
    let { string, whatToReplace, replaceValue } = req.body;

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

    if (typeof string !== "string") {
      string = string.toString();
    }

    if (typeof whatToReplace !== "string") {
      whatToReplace = whatToReplace.toString();
    }

    if (typeof replaceValue !== "string") {
      replaceValue = replaceValue.toString();
    }

    let ignoreCase = false;
    if (req.body.ignoreCase == "true") {
      ignoreCase = true;
    }

    let toReplace;
    if (ignoreCase) {
      toReplace = new RegExp(whatToReplace, "gmi");
    } else {
      toReplace = new RegExp(whatToReplace, "gm");
    }

    const newString = string.replace(toReplace, replaceValue);

    return res.status(200).json({ newString: newString });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = replaceText;
