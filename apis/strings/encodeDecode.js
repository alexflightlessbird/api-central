const encodeDecode = async (req, res) => {
  try {
    const { method, string_array } = req.body;

    let string;
    if (req.body.string == undefined) {
      if (string_array == undefined) {
        return res
          .status(400)
          .json({ error: `Either string or string_array must be defined` });
      }
    } else if (typeof req.body.string !== "string") {
      string = req.body.string.toString();
    } else if (typeof req.body.string === "string") {
      string = req.body.string;
    }

    if (method == undefined) {
      return res.status(400).json({ error: "method must be be defined" });
    }

    if (string) {
      let finalString;

      switch (method) {
        case "encode" || "e":
          finalString = encodeURIComponent(string);
          return res.status(200).json({ newString: finalString });
        case "decode" || "d":
          let tempString = string.replaceAll("%0A", "\\n");
          finalString = decodeURIComponent(tempString);
          return res.status(200).json({ newString: finalString });
        default:
          return res
            .status(400)
            .json({ error: "method must be either encode (e) or decode (d)" });
      }
    } else if (string_array) {
      let finalString = [];

      switch (method) {
        case "encode" || "e":
          for (let i = 0; i < string_array.length; i++) {
            finalString.push(encodeURIComponent(string_array[i]));
          }
          return res.status(200).json({ newString: finalString });
        case "decode" || "d":
          for (let i = 0; i < string_array.length; i++) {
            let tempString = string_array[i].replaceAll("%0A", "\\n");
            finalString.push(decodeURIComponent(tempString));
          }
          return res.status(200).json({ newString: finalString });
        default:
          return res
            .status(400)
            .json({ error: "method must be either encode (e) or decode (d)" });
      }
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = encodeDecode;
