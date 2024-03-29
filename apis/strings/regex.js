//endpoint base code forked from https://github.com/TheRealDax/multi-api/blob/main/endpoints/regex.js

const matchRegex = async (req, res) => {
  try {
    let { string, regex } = req.body;
    if (string == undefined || regex == undefined) {
      return res
        .status(400)
        .json({ error: "Both string and regex must be defined" });
    }

    if (typeof string !== "string") {
      string = string.toString();
    }

    if (typeof regex !== "string") {
      regex = regex.toString();
    }

    const regexObj = new RegExp(regex, "gm");

    let matches;
    const responses = [];

    let numMatches = 0;
    let groups = [];

    while ((matches = regexObj.exec(string)) !== null) {
      const match = matches[0];
      const position = matches.index;

      const matchGroup = matches.slice(1);
      if (matchGroup.length > 0) {
        groups = matchGroup;
      }

      numMatches++;

      responses.push({ match, position, groups });
    }

    if (responses.length > 0) {
      console.log(
        `String: \"${string}\" with regex \"${regex}\" found ${numMatches} matches`
      );
      return res.status(200).json({
        result: responses,
        exists: true,
        numMatches: numMatches,
      });
    } else {
      console.log(`String: ${string} with regex ${regex} found no matches`);
      return res.status(204).json({
        result: "No match found",
        exists: false,
        numMatches: numMatches,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = matchRegex;
