const health = async (req, res) => {
  return res.status(200).json({ message: "Server healthy" });
};

module.exports = health;
