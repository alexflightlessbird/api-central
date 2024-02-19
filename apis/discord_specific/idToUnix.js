const convertSnowflakeToDate = require("../../helper_functions/discord_specific/convertSnowflakeToDate");

const idToTime = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return res.status(400).json({ error: `id must be defined` });
    }

    let timestamp = convertSnowflakeToDate(req.query.id);

    if (!/^\d+$/.test(req.query.id) || !timestamp) {
      return res
        .status(400)
        .json({ error: "Invalid id. Must be a non-negative number." });
    }

    let pad = (v) => `0${v}`.slice(-2);

    const date = pad(timestamp.getUTCDate());
    const month = pad(timestamp.getUTCMonth() + 1);
    const year = timestamp.getUTCFullYear().toString();
    const hours = pad(timestamp.getUTCHours());
    const minutes = pad(timestamp.getUTCMinutes());
    const seconds = pad(timestamp.getUTCSeconds());
    const t = hours >= 12 ? "PM" : "AM";
    const hrs = hours >= 12 ? hours - 12 : hours;
    const unix = timestamp.getTime();

    return res.status(200).json({
      UTCdate24: `${year}-${month}-${date}, ${hours}:${minutes}:${seconds}`,
      UTCdate12: `${year}-${month}-${date}, ${hrs}:${minutes}:${seconds} ${t}`,
      UTCdatefull: {
        year: Number(year),
        month: Number(month),
        date: Number(date),
        hour: Number(hours),
        minute: Number(minutes),
        seconds: Number(seconds),
      },
      unix: Math.floor(unix / 1000).toString(),
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = idToTime;
