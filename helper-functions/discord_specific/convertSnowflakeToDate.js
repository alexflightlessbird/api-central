const DISCORD_EPOCH = 1420070400000;

function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
  const milliseconds = BigInt(snowflake) >> 22n;
  return new Date(Number(milliseconds) + epoch);
}

module.exports = convertSnowflakeToDate;
