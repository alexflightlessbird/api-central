const health = async (req, res) => {
  try {
    return res.status(200).json({ message: "Server healthy" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = health;
