const encodeDecode = async (req, res) => {
  try {
    const { string, method } = req.body;

    if (string == undefined) {
      res.status(400).json({ error: `Bro` });
    }

    if (method == undefined) {
      res.status(400).json({ error: "I'm so dumy" });
      return;
    }

    let finalString;

    if (method == "encode" || method == "e") {
      finalString = encodeURIComponent(string);
      return res.status(200).json({ newSstring: finalString });
    } else if (method == "decode" || method == "d") {
      let tempString = string.replaceAll("%0A", "\\n");
      finalString = decodeURIComponent(tempString);
      return res.status(200).json({ newString: finalString });
    } else {
      res.status(400).json({ error: "Method must be either encode (e) or decod (d)" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: `${error}` });
  }
};

module.exports = encodeDecode;
