const encodeDecode = async (req, res) => {
  try {
    const { string, method, string_array } = req.body;

    if (string == undefined) {
      if (string_array == undefined) {
        res
          .status(400)
          .json({ error: `Either string or string_array must be defined` });
        return;
      }
    }

    if (method == undefined) {
      res.status(400).json({ error: "Method must be be defined" });
      return;
    }

    if (string) {
      let finalString;

      if (method == "encode" || method == "e") {
        finalString = encodeURIComponent(string);
        return res.status(200).json({ newString: finalString });
      } else if (method == "decode" || method == "d") {
        let tempString = string.replaceAll("%0A", "\\n");
        finalString = decodeURIComponent(tempString);
        return res.status(200).json({ newString: finalString });
      } else {
        return res
          .status(400)
          .json({ error: "Method must be either encode (e) or decode (d)" });
      }
    } else if (string_array) {
      let finalString = [];
      if (method == "encode" || method == "e") {
        for (let i = 0; i < string_array.length; i++) {
          finalString.push(encodeURIComponent(string_array[i]));
        }
        return res.status(200).json({ strings: finalString });
      } else if (method == "decode" || method == "d") {
        for (let i = 0; i < string_array.length; i++) {
          let tempString = string_array[i].replaceAll("%0A", "\\n");
          finalString.push(decodeURIComponent(tempString));
        }
        return res.status(200).json({ strings: finalString });
      } else {
        return res
          .status(400)
          .json({ error: "Method must be either encode (e) or decode (d)" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: `${error}` });
  }
};

module.exports = encodeDecode;
