require("dotenv").config();
const auth_code = process.env.AUTH_CODE;

function checkAuthorization(req, res, next) {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || authorizationHeader !== auth_code) {
    console.log("Authorized endpoint not accessed");
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log("Authorized endpoint accessed");
  next();
}

module.exports = checkAuthorization;
